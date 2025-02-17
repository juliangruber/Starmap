import { getChildren } from '../../lib/parser';

/**
 * Test data obtained from calling getIssue() on github.com/protocol/engres/issues/5 on 2023-02-10 @ 5pm PST
 */
const example_body_html = '<p dir=\"auto\">children:</p>\n<ul dir=\"auto\">\n<li><a aria-label=\"Issue #5\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1468803547\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/bedrock/issues/5\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/bedrock/issues/5/hovercard\" href=\"https://github.com/protocol/bedrock/issues/5\">protocol/bedrock#5</a></li>\n<li><a aria-label=\"Issue #11\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1468828351\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/bedrock/issues/11\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/bedrock/issues/11/hovercard\" href=\"https://github.com/protocol/bedrock/issues/11\">protocol/bedrock#11</a></li>\n<li><a aria-label=\"Issue #1144\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1462056698\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-project/ref-fvm/issues/1144\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-project/ref-fvm/issues/1144/hovercard\" href=\"https://github.com/filecoin-project/ref-fvm/issues/1144\">filecoin-project/ref-fvm#1144</a></li>\n<li><a aria-label=\"Issue #1143\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1462053266\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-project/ref-fvm/issues/1143\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-project/ref-fvm/issues/1143/hovercard\" href=\"https://github.com/filecoin-project/ref-fvm/issues/1143\">filecoin-project/ref-fvm#1143</a></li>\n<li><a aria-label=\"Issue #34\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1470149244\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/netops/issues/34\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/netops/issues/34/hovercard\" href=\"https://github.com/protocol/netops/issues/34\">protocol/netops#34</a></li>\n<li><a aria-label=\"Issue #47\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1470248081\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/netops/issues/47\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/netops/issues/47/hovercard\" href=\"https://github.com/protocol/netops/issues/47\">protocol/netops#47</a></li>\n<li><a aria-label=\"Issue #8\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1464684250\" data-permission-text=\"Title is private\" data-url=\"https://github.com/drand/roadmap/issues/8\" data-hovercard-type=\"issue\" data-hovercard-url=\"/drand/roadmap/issues/8/hovercard\" href=\"https://github.com/drand/roadmap/issues/8\">drand/roadmap#8</a></li>\n<li><a aria-label=\"Issue #12\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1464687876\" data-permission-text=\"Title is private\" data-url=\"https://github.com/drand/roadmap/issues/12\" data-hovercard-type=\"issue\" data-hovercard-url=\"/drand/roadmap/issues/12/hovercard\" href=\"https://github.com/drand/roadmap/issues/12\">drand/roadmap#12</a></li>\n<li><a aria-label=\"Issue #180\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1394534093\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/ConsensusLab/issues/180\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/ConsensusLab/issues/180/hovercard\" href=\"https://github.com/protocol/ConsensusLab/issues/180\">protocol/ConsensusLab#180</a></li>\n<li><a aria-label=\"Issue #185\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1394589312\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/ConsensusLab/issues/185\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/ConsensusLab/issues/185/hovercard\" href=\"https://github.com/protocol/ConsensusLab/issues/185\">protocol/ConsensusLab#185</a></li>\n<li><a aria-label=\"Issue #186\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1394590754\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/ConsensusLab/issues/186\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/ConsensusLab/issues/186/hovercard\" href=\"https://github.com/protocol/ConsensusLab/issues/186\">protocol/ConsensusLab#186</a></li>\n<li><a aria-label=\"Issue #3\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1461226183\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-station/roadmap/issues/3\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-station/roadmap/issues/3/hovercard\" href=\"https://github.com/filecoin-station/roadmap/issues/3\">filecoin-station/roadmap#3</a></li>\n<li><a aria-label=\"Issue #10\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1575972127\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-station/roadmap/issues/10\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-station/roadmap/issues/10/hovercard\" href=\"https://github.com/filecoin-station/roadmap/issues/10\">filecoin-station/roadmap#10</a></li>\n<li><a aria-label=\"Issue #1\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1467798001\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-saturn/roadmap/issues/1\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-saturn/roadmap/issues/1/hovercard\" href=\"https://github.com/filecoin-saturn/roadmap/issues/1\">filecoin-saturn/roadmap#1</a></li>\n<li><a aria-label=\"Issue #4\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1461231696\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-station/roadmap/issues/4\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-station/roadmap/issues/4/hovercard\" href=\"https://github.com/filecoin-station/roadmap/issues/4\">filecoin-station/roadmap#4</a></li>\n<li><a aria-label=\"Issue #2\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1467801960\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-saturn/roadmap/issues/2\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-saturn/roadmap/issues/2/hovercard\" href=\"https://github.com/filecoin-saturn/roadmap/issues/2\">filecoin-saturn/roadmap#2</a></li>\n<li><a aria-label=\"Issue #19\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1464616958\" data-permission-text=\"Title is private\" data-url=\"https://github.com/cryptonetlab/roadmap/issues/19\" data-hovercard-type=\"issue\" data-hovercard-url=\"/cryptonetlab/roadmap/issues/19/hovercard\" href=\"https://github.com/cryptonetlab/roadmap/issues/19\">cryptonetlab/roadmap#19</a></li>\n</ul>\n<p dir=\"auto\">eta: 2023Q2</p>\n<p dir=\"auto\">View in <a href=\"https://www.starmaps.app/roadmap/github.com/protocol/engres/issues/5#simple\" rel=\"nofollow\">https://www.starmaps.app/roadmap/github.com/protocol/engres/issues/5#simple</a></p>'
const example_body_text = 'children:\n\nprotocol/bedrock#5\nprotocol/bedrock#11\nfilecoin-project/ref-fvm#1144\nfilecoin-project/ref-fvm#1143\nprotocol/netops#34\nprotocol/netops#47\ndrand/roadmap#8\ndrand/roadmap#12\nprotocol/ConsensusLab#180\nprotocol/ConsensusLab#185\nprotocol/ConsensusLab#186\nfilecoin-station/roadmap#3\nfilecoin-station/roadmap#10\nfilecoin-saturn/roadmap#1\nfilecoin-station/roadmap#4\nfilecoin-saturn/roadmap#2\ncryptonetlab/roadmap#19\n\neta: 2023Q2\nView in https://www.starmaps.app/roadmap/github.com/protocol/engres/issues/5#simple'
const example_body = 'children: \r\n- https://github.com/protocol/bedrock/issues/5\r\n- https://github.com/protocol/bedrock/issues/11\r\n- https://github.com/filecoin-project/ref-fvm/issues/1144\r\n- https://github.com/filecoin-project/ref-fvm/issues/1143\r\n- https://github.com/protocol/netops/issues/34\r\n- https://github.com/protocol/netops/issues/47\r\n- https://github.com/drand/roadmap/issues/8\r\n- https://github.com/drand/roadmap/issues/12\r\n- https://github.com/protocol/ConsensusLab/issues/180\r\n- https://github.com/protocol/ConsensusLab/issues/185\r\n- https://github.com/protocol/ConsensusLab/issues/186\r\n- https://github.com/filecoin-station/roadmap/issues/3\r\n- https://github.com/filecoin-station/roadmap/issues/10\r\n- https://github.com/filecoin-saturn/roadmap/issues/1\r\n- https://github.com/filecoin-station/roadmap/issues/4\r\n- https://github.com/filecoin-saturn/roadmap/issues/2\r\n- https://github.com/cryptonetlab/roadmap/issues/19\r\n\r\neta: 2023Q2\r\n\r\nView in https://www.starmaps.app/roadmap/github.com/protocol/engres/issues/5#simple\r\n'

/**
 * Test data obtained from calling getIssue() on github.com/ipfs/ipfs-gui/issues/106 on 2023-02-10 @ 5:52pm PST
 */
const example_tasklist_body = 'eta: 2023Q4\r\n\r\nchildren:\r\n- [ ] #121\r\n- [ ] #122\r\n- [ ] #123\r\n- [ ] #124\r\n\r\n```[tasklist]\r\n### Tasks\r\n- [ ] #121\r\n- [ ] #122\r\n- [ ] #123\r\n- [ ] #124\r\n```\r\n'

/**
 * Test data manually removing "children:" from the above example_tasklist_body
 */
const example_tasklist_body_only = 'eta: 2023Q4\r\n\r\n```[tasklist]\r\n### Tasks\r\n- [ ] #121\r\n- [ ] #122\r\n- [ ] #123\r\n- [ ] #124\r\n```\r\n'

const expectedResult = [
  {
    group: 'children:',
    html_url: 'https://github.com/protocol/bedrock/issues/5'
  },
  {
    group: 'children:',
    html_url: 'https://github.com/protocol/bedrock/issues/11',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/filecoin-project/ref-fvm/issues/1144',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/filecoin-project/ref-fvm/issues/1143',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/protocol/netops/issues/34',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/protocol/netops/issues/47',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/drand/roadmap/issues/8',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/drand/roadmap/issues/12',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/protocol/ConsensusLab/issues/180',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/protocol/ConsensusLab/issues/185',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/protocol/ConsensusLab/issues/186',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/filecoin-station/roadmap/issues/3',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/filecoin-station/roadmap/issues/10',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/filecoin-saturn/roadmap/issues/1',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/filecoin-station/roadmap/issues/4',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/filecoin-saturn/roadmap/issues/2',
  },
  {
    group: 'children:',
    html_url: 'https://github.com/cryptonetlab/roadmap/issues/19',
  },
]

describe('parser', function() {
  describe('getChildren', function() {
    it('Can parse children from issue.body_html', function() {
      const children = getChildren({ body_html: example_body_html, body: '', html_url: '' });
      expect(Array.isArray(children)).toBe(true);
      expect(children).toHaveLength(17);
      expect(children).toStrictEqual(expectedResult)
    })
    it('Can parse children from issue.body_text', function() {
      const children = getChildren({ body_html: '', body: example_body_text, html_url: '' });
      expect(Array.isArray(children)).toBe(true);
      expect(children).toHaveLength(17);
      expect(children).toStrictEqual(expectedResult)
    })
    it('Can parse children from issue.body', function() {
      const children = getChildren({ body_html: '', body: example_body, html_url: '' });
      expect(Array.isArray(children)).toBe(true);
      expect(children).toHaveLength(17);
      expect(children).toStrictEqual(expectedResult)
    })

    it('Can parse tasklist children from body that also has children:', function() {
      const children = getChildren({ body_html: '', body: example_tasklist_body, html_url: 'https://github.com/ipfs/ipfs-gui/issues/106' });
      expect(Array.isArray(children)).toBe(true);
      expect(children).toHaveLength(4);
      expect(children).toStrictEqual([
        { group: 'tasklist', html_url: 'https://github.com/ipfs/ipfs-gui/issues/121' },
        { group: 'tasklist', html_url: 'https://github.com/ipfs/ipfs-gui/issues/122' },
        { group: 'tasklist', html_url: 'https://github.com/ipfs/ipfs-gui/issues/123' },
        { group: 'tasklist', html_url: 'https://github.com/ipfs/ipfs-gui/issues/124' }
      ])
    })

    it('Can parse tasklist children from body', function() {
      const children = getChildren({ body_html: '', body: example_tasklist_body_only, html_url: 'https://github.com/ipfs/ipfs-gui/issues/106' });
      expect(Array.isArray(children)).toBe(true);
      expect(children).toHaveLength(4);
      expect(children).toStrictEqual([
        { group: 'tasklist', html_url: 'https://github.com/ipfs/ipfs-gui/issues/121' },
        { group: 'tasklist', html_url: 'https://github.com/ipfs/ipfs-gui/issues/122' },
        { group: 'tasklist', html_url: 'https://github.com/ipfs/ipfs-gui/issues/123' },
        { group: 'tasklist', html_url: 'https://github.com/ipfs/ipfs-gui/issues/124' }
      ])
    })

    /**
     * To address https://github.com/pln-planning-tools/Starmap/issues/324
     */
    it('Can parse children from issue.body with extraneous link', function() {
      const children = getChildren({ body_html: '', body: 'eta: 2023Q4\r\n\r\nchildren:\r\n- https://github.com/filecoin-station/roadmap/issues/5\r\n- https://github.com/filecoin-station/roadmap/issues/7\r\n- https://github.com/filecoin-station/roadmap/issues/3\r\n- #10 \r\n- #11\r\n\r\nView the roadmap here: https://starmap.site/roadmap/github.com/filecoin-station/roadmap/issues/1\r\n', html_url: 'https://github.com/filecoin-station/roadmap/issues/1' });
      expect(Array.isArray(children)).toBe(true);
      expect(children).toHaveLength(5);
      expect(children).toStrictEqual([
        { group: 'children:', html_url: 'https://github.com/filecoin-station/roadmap/issues/5' },
        { group: 'children:', html_url: 'https://github.com/filecoin-station/roadmap/issues/7' },
        { group: 'children:', html_url: 'https://github.com/filecoin-station/roadmap/issues/3' },
        { group: 'children:', html_url: 'https://github.com/filecoin-station/roadmap/issues/10' },
        { group: 'children:', html_url: 'https://github.com/filecoin-station/roadmap/issues/11' }
      ])
    })

    /**
     * To address https://github.com/pln-planning-tools/Starmap/issues/324
     */
    it('Can parse children from issue.body with extraneous markdown link', function() {
      const children = getChildren({ body_html: '', body: 'children:\r\n - https://github.com/filecoin-project/rust-fil-proofs/issues/1644\r\n\r\n[Rendered StarMaps view](https://www.starmaps.app/roadmap/github.com/filecoin-project/rust-fil-proofs/issues/1640#detail).', html_url: 'https://github.com/filecoin-project/rust-fil-proofs/issues/1640' });
      expect(Array.isArray(children)).toBe(true);
      expect(children).toHaveLength(1);
      expect(children).toStrictEqual([
        { group: 'children:', html_url: 'https://github.com/filecoin-project/rust-fil-proofs/issues/1644' }
      ])
    })

    /**
     * To address https://github.com/pln-planning-tools/Starmap/issues/324
     */
    it('Can parse children from issue.body with a lot of additional text and non-children links', function() {
      const children = getChildren({ body_html: '', body: `eta: 2023-10\r\ndescription:\r\nThis issue is intended to capture discussion around Testground's Roadmap\r\nBecause GitHub doesn't have any feature to comment on Markdown files, please use this issue to leave any feedback, proposals, etc.\r\n\r\nchildren:\r\n- https://github.com/testground/testground/issues/1533\r\n- https://github.com/testground/testground/issues/1512\r\n- https://github.com/testground/testground/issues/1514\r\n- https://github.com/testground/testground/issues/1524\r\n- https://github.com/testground/testground/issues/1529\r\n- https://github.com/testground/testground/issues/1523\r\n\r\n---\r\n\r\n# Current Roadmap\r\n\r\n🛣🗺 Roadmap document: https://github.com/testground/testground/blob/master/ROADMAP.md\r\n\r\nStarmap viewer for this roadmap: https://www.starmaps.app/roadmap/github.com/testground/testground/issues/1491#simple\r\n\r\n# Current Status of the Roadmap:\r\n\r\n- 2022-10-10: We don't have full maintainer alignment on Roadmap items and priorities. As we resolve these, we will update the roadmap.\r\n\r\n## Unresolved questions:\r\n\r\n- [ ] https://github.com/testground/testground/pull/1484#discussion_r992168145\r\n\r\n## Roadmap drafts:\r\n- 1st draft: https://github.com/testground/testground/pull/1484`, html_url: 'https://github.com/testground/testground/issues/1491' });
      expect(Array.isArray(children)).toBe(true);
      expect(children).toHaveLength(6);
      expect(children).toStrictEqual([
        { group: 'children:', html_url: 'https://github.com/testground/testground/issues/1533' },
        { group: 'children:', html_url: 'https://github.com/testground/testground/issues/1512' },
        { group: 'children:', html_url: 'https://github.com/testground/testground/issues/1514' },
        { group: 'children:', html_url: 'https://github.com/testground/testground/issues/1524' },
        { group: 'children:', html_url: 'https://github.com/testground/testground/issues/1529' },
        { group: 'children:', html_url: 'https://github.com/testground/testground/issues/1523' },
      ])
    })
  })
})
