import { Box } from '@chakra-ui/react';
import { none, State, useHookstate } from '@hookstate/core';
import type { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { StarmapsBreadcrumb } from '../../components/breadcrumb';

import { ErrorNotificationDisplay } from '../../components/errors/ErrorNotificationDisplay';
import PageHeader from '../../components/layout/PageHeader';
import { RoadmapTabbedView } from '../../components/roadmap-grid/RoadmapTabbedView';
import NewRoadmap from '../../components/roadmap/NewRoadmap';
import { BASE_PROTOCOL } from '../../config/constants';
import { setDateGranularity } from '../../hooks/useDateGranularity';
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';
import { setViewMode } from '../../hooks/useViewMode';
import { assignCompletionRateToIssues } from '../../lib/calculateCompletionRate';
import { DateGranularityState, RoadmapMode, ViewMode } from '../../lib/enums';
import { findIssueDataByUrl } from '../../lib/findIssueDataByUrl';
import { mergeStarMapsErrorGroups } from '../../lib/mergeStarMapsErrorGroups';
import { paramsFromUrl } from '../../lib/paramsFromUrl';
import {
  IssueData,
  PendingChildApiResponse,
  PendingChildApiResponseFailure,
  PendingChildApiResponseSuccess,
  PendingChildren,
  QueryParameters,
  RoadmapApiResponse,
  RoadmapApiResponseFailure,
  RoadmapApiResponseSuccess,
  RoadmapServerSidePropsResult,
  StarMapsIssueErrorsGrouped
} from '../../lib/types';

/**
 * From https://vercel.com/docs/concepts/edge-network/caching#stale-while-revalidate
 * This tells our Vercel Edge Network cache the value is fresh for 30 seconds. If a request is repeated within the
 * next 30 seconds, the previously cached value is still fresh. The header x-vercel-cache present in the response will
 * show the value HIT. If the request is repeated between 30 and 86400 seconds later, the cached value will be stale but
 * still render. In the background, a revalidation request will be made to populate the cache with a fresh value.
 * x-vercel-cache will have the value STALE until the cache is refreshed.
 */
const fetchHeaders = {
  'Cache-Control': 's-maxage=30, stale-while-revalidate=86400' // 30 second cache, hold for 24 hours, revalidate after 30 seconds
}

export async function getServerSideProps(context): Promise<RoadmapServerSidePropsResult> {
  const [_hostname, owner, repo, _, issue_number] = context.query.slug;
  const { filter_group, mode, timeUnit }: QueryParameters = context.query;

  return {
    props: {
      owner,
      repo,
      issue_number,
      isLocal: process.env.IS_LOCAL === 'true',
      groupBy: filter_group || null,
      mode: mode || RoadmapMode.grid,
      dateGranularity: timeUnit || DateGranularityState.Months,
      baseUrl: `${BASE_PROTOCOL}://${process.env.VERCEL_URL}`,
    }
  }
}

export default function RoadmapPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { error: serverError, isLocal, mode, dateGranularity, issue_number, repo, owner } = props;

  const starMapsErrorsState = useHookstate<StarMapsIssueErrorsGrouped[]>([]);
  const roadmapLoadErrorState = useHookstate<{ code: string; message: string } | null>(null)
  const issueDataState = useHookstate<IssueData | null>(null);
  const pendingChildrenState = useHookstate<PendingChildren[]>([])
  const asyncIssueDataState = useHookstate<IssueData[]>([])
  const globalLoadingState = useGlobalLoadingState();
  const [isRootIssueLoading, setIsRootIssueLoading] = useState(false);
  const [isPendingChildrenLoading, setIsPendingChildrenLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    if (isRootIssueLoading || issue_number == null || repo == null || owner == null) return;
    setIsRootIssueLoading(true);
    const fetchRoadMap = async () => {
      if (!active) {
        return;
      }
      const roadmapApiUrl = `${window.location.origin}/api/roadmap?owner=${owner}&repo=${repo}&issue_number=${issue_number}`
      try {
        const apiResult = await fetch(new URL(roadmapApiUrl), { method: 'GET', signal: controller.signal, headers: fetchHeaders })
        // console.log(`roadmap: ${owner}/${repo}/${issue_number} - x-vercel-cache: `, apiResult.headers.get('x-vercel-cache'))

        const roadmapResponse: RoadmapApiResponse = await apiResult.json();

        const roadmapResponseSuccess = roadmapResponse as RoadmapApiResponseSuccess;
        const roadmapResponseFailure = roadmapResponse as RoadmapApiResponseFailure;
        if (roadmapResponse.errors != null) {
          starMapsErrorsState.set(roadmapResponse.errors);
        }
        pendingChildrenState.set(() => roadmapResponseSuccess.pendingChildren)

        if (roadmapResponseFailure.error != null) {
          roadmapLoadErrorState.set(roadmapResponseFailure.error);
        } else {
          issueDataState.set(roadmapResponseSuccess.data);
        }

      } catch (err) {
        if (!(err as Error).toString().includes('AbortError')) {
          roadmapLoadErrorState.set({ code: `Error fetching ${roadmapApiUrl}`, message: `Error fetching ${roadmapApiUrl}: ${(err as Error).toString()}` })
        }
      }
      setIsRootIssueLoading(false);
    };

    fetchRoadMap();
    return () => {
      controller.abort();
      active = false;
      setIsRootIssueLoading(false);
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issue_number, repo, owner]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    if (isPendingChildrenLoading) return;
    const typedPendingChild = pendingChildrenState[0];
    if (typedPendingChild == null || typedPendingChild.html_url?.value == null) {
      pendingChildrenState[0].set(none);
      return
    }
    const fetchPendingChildren = async () => {
      if (!active) {
        return;
      }
      setIsPendingChildrenLoading(true);

      const parent = findIssueDataByUrl(issueDataState.value as IssueData, typedPendingChild.parentHtmlUrl.value)
      // we can reduce the size of the parent, because we have the parent on the client and use the one we have when adding the success response
      const parentJson = JSON.stringify({ ...parent, children: [] })

      const encodedParentJson = encodeURIComponent(parentJson)
      const { issue_number, owner, repo } = paramsFromUrl(typedPendingChild.html_url.value)
      const pendingChildApiUrl = new URL(`${window.location.origin}/api/pendingChild?owner=${owner}&repo=${repo}&issue_number=${issue_number}&parentJson=${encodedParentJson}`);

      try {
        const apiResult = await fetch(pendingChildApiUrl, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...fetchHeaders
          },
        });
        // console.log(`pendingChild: ${owner}/${repo}/${issue_number} - x-vercel-cache: `, apiResult.headers.get('x-vercel-cache'))
        const pendingChildResponse: PendingChildApiResponse = await apiResult.json();
        const pendingChildFailure = pendingChildResponse as PendingChildApiResponseFailure;
        const pendingChildSuccess = pendingChildResponse as PendingChildApiResponseSuccess;
        if (pendingChildFailure.error != null) {
          roadmapLoadErrorState.set(pendingChildFailure.error);
        } else {
          asyncIssueDataState.merge([{ ...pendingChildSuccess.data, parent: parent as IssueData }]);
          if (pendingChildSuccess.errors.length !== 0) {
            starMapsErrorsState.set((currentErrors) => mergeStarMapsErrorGroups(currentErrors, pendingChildSuccess.errors))
          }
        }
      } catch (err) {
        if (!(err as Error).toString().includes('AbortError')) {
          roadmapLoadErrorState.set({ code: `Error fetching ${pendingChildApiUrl}`, message: `Error fetching ${pendingChildApiUrl}: ${(err as Error).toString()}` })
        }
      }
      pendingChildrenState[0].set(none);

      setIsPendingChildrenLoading(false);
    };
    fetchPendingChildren();
    return () => {
      controller.abort();
      active = false;
      setIsPendingChildrenLoading(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issue_number, repo, owner, isRootIssueLoading, pendingChildrenState.length]);

  /**
   * Add asyncIssueData items to issueDataState
   */
  useEffect(() => {
    const issueData = issueDataState.get({ noproxy: true }) as IssueData;
    const asyncIssues = asyncIssueDataState.get();
    const newIssueData = asyncIssueDataState[0];
    if (asyncIssues.length === 0 || newIssueData == null) {
      asyncIssueDataState[0].set(none);
      return
    }
    try {
      const parentIndex = issueData.children.findIndex((potentialParent) => potentialParent.html_url === newIssueData.parent.html_url.value);
      if (parentIndex > -1) {
        (issueDataState as State<IssueData>).children[parentIndex].children.merge([newIssueData.get({ noproxy: true })]);
      } else {
        throw new Error('Could not find parentIndex');
      }

    } catch (err) {
      console.log('getting parent - error', err);
      console.log('getting parent - error - issueData', issueData);
    }
    asyncIssueDataState[0].set(none)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncIssueDataState.value]);

  /**
   * Resolve global loading after root issue and pending issues are done.
   */
  useEffect(() => {
    if (!isRootIssueLoading && pendingChildrenState.length === 0 && asyncIssueDataState.length === 0) {
      assignCompletionRateToIssues(issueDataState)
      globalLoadingState.stop();
    } else {
      globalLoadingState.start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRootIssueLoading, pendingChildrenState.length, asyncIssueDataState.length])

  useEffect(() => {
    setDateGranularity(dateGranularity);
  }, [dateGranularity]);

  const router = useRouter();
  const urlPath = router.asPath
  useEffect(() => {
    const hashString = urlPath.split('#')[1] as ViewMode ?? ViewMode.Simple;
    setViewMode(hashString);
  }, [urlPath]);

  return (
    <>
      <PageHeader />
      <div style={{ overflowY: 'auto', height: 'calc(100vh - 120px)', paddingTop: '28px' }}>
        {issueDataState.ornull != null && <StarmapsBreadcrumb currentTitle={issueDataState.ornull.title.value} />}
        <ErrorNotificationDisplay errorsState={starMapsErrorsState} issueDataState={issueDataState}/>
        <Box pr={{ base:"30px", sm:"30px", md:"60px", lg:"120px" }} pl={{ base:"30px", sm:"30px", md:"60px", lg:"120px" }} >
          {!!serverError && <Box color='red.500'>{serverError.message}</Box>}
          {roadmapLoadErrorState.ornull && <Box color='red.500'>{roadmapLoadErrorState.ornull.message.value}</Box>}
          {!!issueDataState.ornull && mode === 'd3' && <NewRoadmap issueData={issueDataState.get({ noproxy: true }) as IssueData} isLocal={isLocal} />}
          {!!issueDataState.ornull && mode === 'grid' && (
            <RoadmapTabbedView issueDataState={issueDataState as State<IssueData>} />
          )}
        </Box>
      </div>
    </>
  );
}
