import NeonView from '../src/NeonView.js';
import DisplayPanel from '../src/DisplayPanel/DisplayPanel.js';
import DivaView from '../src/DivaView.js';
import SingleView from '../src/SingleView/SingleView.js';
import SingleEditMode from '../src/SquareEdit/SingleEditMode.js';
import InfoModule from '../src/InfoModule.js';
import TextView from '../src/TextView.js';

import PouchDb from 'pouchdb';
const $ = require('jquery');

let mei = getGetParam('page');
let mode = getGetParam('mode');
let map = new Map();

// Since in local mode there are no GET parameters, mei will be null
if (mode === 'demo-page') {
  console.log('Demo page');
  $.get('./mei/' + mei + '.mei', (data) => {
    map.set(0, data);
    let params = {
      mode: 'single',
      options: {
        image: './img/' + mei + '.png',
        meiMap: map,
        name: mei
      },
      View: SingleView,
      Display: DisplayPanel,
      Info: InfoModule,
      NeumeEdit: SingleEditMode,
      TextView: TextView
    };

    var view = new NeonView(params);
    view.start();
  });
} else if (mode === 'demo-iiif') {
  console.log('IIIF');
  let params = {
    mode: 'iiif',
    options: {
      manifest: 'https://images.simssa.ca/iiif/manuscripts/cdn-hsmu-m2149l4/manifest.json'
    },
    View: DivaView,
    Display: DisplayPanel,
    Info: InfoModule,
    TextView: TextView
  };
  if (mei === 'Salzinnes') {
    console.log('Salzinnes');
    $.get('https://images.simssa.ca/iiif/manuscripts/cdn-hsmu-m2149l4/manifest.json').then((manifest) => {
      params.options.name = manifest.label;
      console.log(manifest);
      return $.get('./mei/CF-014.mei');
    }).then((data) => {
      map.set(0, data);
      return $.get('./mei/CF-522.mei');
    }).then((data) => {
      map.set(1, data);
      return $.get('./mei/CF-005.mei');
    }).then((data) => {
      map.set(2, data);
      return $.get('./mei/CF-528.mei');
    }).then((data) => {
      map.set(3, data);
      return $.get('./mei/CF-010.mei');
    }).then((data) => {
      map.set(4, data);
      return $.get('./mei/CF-527.mei');
    }).then((data) => {
      map.set(5, data);
      return $.get('./mei/CF-009.mei');
    }).then((data) => {
      map.set(6, data);
      return $.get('./mei/CF-526.mei');
    }).then((data) => {
      map.set(7, data);
      return $.get('./mei/CF-011.mei');
    }).then((data) => {
      map.set(8, data);
      return $.get('./mei/CF-525.mei');
    }).then((data) => {
      map.set(9, data);
      return $.get('./mei/CF-012.mei');
    }).then((data) => {
      map.set(10, data);
      return $.get('./mei/CF-524.mei');
    }).then((data) => {
      map.set(11, data);
      return $.get('./mei/CF-013.mei');
    }).then((data) => {
      map.set(12, data);
      return $.get('./mei/CF-523.mei');
    }).then((data) => {
      map.set(13, data);
      return $.get('./mei/CF-015.mei');
    }).then((data) => {
      map.set(14, data);
      return $.get('./mei/CF-517.mei');
    }).then((data) => {
      map.set(15, data);
      return $.get('./mei/CF-016.mei');
    }).then((data) => {
      map.set(16, data);
      return $.get('./mei/CF-516.mei');
    }).then((data) => {
      map.set(17, data);
      return $.get('./mei/CF-017.mei');
    }).then((data) => {
      map.set(18, data);
      return $.get('./mei/CF-515.mei');
    }).then((data) => {
      map.set(19, data);
      return $.get('./mei/CF-018.mei');
    }).then((data) => {
      map.set(20, data);
      return $.get('./mei/CF-514.mei');
    }).then((data) => {
      map.set(21, data);
      return $.get('./mei/CF-019.mei');
    }).then((data) => {
      map.set(22, data);
      return $.get('./mei/CF-513.mei');
    }).then((data) => {
      map.set(23, data);
      return $.get('./mei/CF-020.mei');
    }).then((data) => {
      map.set(24, data);
      return $.get('./mei/CF-512.mei');
    }).then((data) => {
      map.set(25, data);
      return $.get('./mei/CF-024.mei');
    }).then((data) => {
      map.set(26, data);
      return $.get('./mei/CF-511.mei');
    }).then((data) => {
      map.set(27, data);
      return $.get('./mei/CF-025.mei');
    }).then((data) => {
      map.set(28, data);
      return $.get('./mei/CF-510.mei');
    }).then((data) => {
      map.set(29, data);
      return $.get('./mei/CF-026.mei');
    }).then((data) => {
      map.set(30, data);
      return $.get('./mei/CF-509.mei');
    }).then((data) => {
      map.set(31, data);
      return $.get('./mei/CF-027.mei');
    }).then((data) => {
      map.set(32, data);
      /* return $.get('./mei/CF-508.mei');
    }).then((data) => {
      map.set(33, data); */
      return $.get('./mei/CF-028.mei');
    }).then((data) => {
      map.set(34, data);
      return $.get('./mei/CF-507.mei');
    }).then((data) => {
      map.set(35, data);
      return $.get('./mei/CF-029.mei');
    }).then((data) => {
      map.set(36, data);
      return $.get('./mei/CF-506.mei');
    }).then((data) => {
      map.set(37, data);
      return $.get('./mei/CF-030.mei');
    }).then((data) => {
      map.set(38, data);
      return $.get('./mei/CF-505.mei');
    }).then((data) => {
      map.set(39, data);
      return $.get('./mei/CF-031.mei');
    }).then((data) => {
      map.set(40, data);
      return $.get('./mei/CF-504.mei');
    }).then((data) => {
      map.set(41, data);
      return $.get('./mei/CF-032.mei');
    }).then((data) => {
      map.set(42, data);
      return $.get('./mei/CF-503.mei');
    }).then((data) => {
      map.set(43, data);
      return $.get('./mei/CF-033.mei');
    }).then((data) => {
      map.set(44, data);
      return $.get('./mei/CF-502.mei');
    }).then((data) => {
      map.set(45, data);
      return $.get('./mei/CF-034.mei');
    }).then((data) => {
      map.set(46, data);
      return $.get('./mei/CF-501.mei');
    }).then((data) => {
      map.set(47, data);
      return $.get('./mei/CF-035.mei');
    }).then((data) => {
      map.set(48, data);
      return $.get('./mei/CF-500.mei');
    }).then((data) => {
      map.set(49, data);
      return $.get('./mei/CF-036.mei');
    }).then((data) => {
      map.set(50, data);
      return $.get('./mei/CF-499.mei');
    }).then((data) => {
      map.set(51, data);
      return $.get('./mei/CF-037.mei');
    }).then((data) => {
      map.set(52, data);
      return $.get('./mei/CF-498.mei');
    }).then((data) => {
      map.set(53, data);
      return $.get('./mei/CF-038.mei');
    }).then((data) => {
      map.set(54, data);
      return $.get('./mei/CF-497.mei');
    }).then((data) => {
      map.set(55, data);
      return $.get('./mei/CF-039.mei');
    }).then((data) => {
      map.set(56, data);
      return $.get('./mei/CF-496.mei');
    }).then((data) => {
      map.set(57, data);
      return $.get('./mei/CF-040.mei');
    }).then((data) => {
      map.set(58, data);
      return $.get('./mei/CF-495.mei');
    }).then((data) => {
      map.set(59, data);
      return $.get('./mei/CF-041.mei');
    }).then((data) => {
      map.set(60, data);
      return $.get('./mei/CF-494.mei');
    }).then((data) => {
      map.set(61, data);
      return $.get('./mei/CF-042.mei');
    }).then((data) => {
      map.set(62, data);
      return $.get('./mei/CF-492.mei');
    }).then((data) => {
      map.set(63, data);
      return $.get('./mei/CF-044.mei');
    }).then((data) => {
      map.set(64, data);
      return $.get('./mei/CF-491.mei');
    }).then((data) => {
      map.set(65, data);
      return $.get('./mei/CF-045.mei');
    }).then((data) => {
      map.set(66, data);
      return $.get('./mei/CF-490.mei');
    }).then((data) => {
      map.set(67, data);
      return $.get('./mei/CF-046.mei');
    }).then((data) => {
      map.set(68, data);
      return $.get('./mei/CF-489.mei');
    }).then((data) => {
      map.set(69, data);
      return $.get('./mei/CF-047.mei');
    }).then((data) => {
      map.set(70, data);
      return $.get('./mei/CF-488.mei');
    }).then((data) => {
      map.set(71, data);
      return $.get('./mei/CF-048.mei');
    }).then((data) => {
      map.set(72, data);
      return $.get('./mei/CF-487.mei');
    }).then((data) => {
      map.set(73, data);
      return $.get('./mei/CF-049.mei');
    }).then((data) => {
      map.set(74, data);
      return $.get('./mei/CF-486.mei');
    }).then((data) => {
      map.set(75, data);
      return $.get('./mei/CF-050.mei');
    }).then((data) => {
      map.set(76, data);
      return $.get('./mei/CF-485.mei');
    }).then((data) => {
      map.set(77, data);
      return $.get('./mei/CF-051.mei');
    }).then((data) => {
      map.set(78, data);
      return $.get('./mei/CF-484.mei');
    }).then((data) => {
      map.set(79, data);
      return $.get('./mei/CF-052.mei');
    }).then((data) => {
      map.set(80, data);
      return $.get('./mei/CF-483.mei');
    }).then((data) => {
      map.set(81, data);
      return $.get('./mei/CF-053.mei');
    }).then((data) => {
      map.set(82, data);
      return $.get('./mei/CF-482.mei');
    }).then((data) => {
      map.set(83, data);
      return $.get('./mei/CF-054.mei');
    }).then((data) => {
      map.set(84, data);
      return $.get('./mei/CF-481.mei');
    }).then((data) => {
      map.set(85, data);
      return $.get('./mei/CF-055.mei');
    }).then((data) => {
      map.set(86, data);
      return $.get('./mei/CF-480.mei');
    }).then((data) => {
      map.set(87, data);
      return $.get('./mei/CF-056.mei');
    }).then((data) => {
      map.set(88, data);
      /* return $.get('./mei/CF-479.mei');
    }).then((data) => {
      map.set(89, data); */
      return $.get('./mei/CF-058.mei');
    }).then((data) => {
      map.set(90, data);
      return $.get('./mei/CF-477.mei');
    }).then((data) => {
      map.set(91, data);
      return $.get('./mei/CF-059.mei');
    }).then((data) => {
      map.set(92, data);
      return $.get('./mei/CF-476.mei');
    }).then((data) => {
      map.set(93, data);
      return $.get('./mei/CF-060.mei');
    }).then((data) => {
      map.set(94, data);
      return $.get('./mei/CF-475.mei');
    }).then((data) => {
      map.set(95, data);
      return $.get('./mei/CF-061.mei');
    }).then((data) => {
      map.set(96, data);
      return $.get('./mei/CF-474.mei');
    }).then((data) => {
      map.set(97, data);
      return $.get('./mei/CF-062.mei');
    }).then((data) => {
      map.set(98, data);
      return $.get('./mei/CF-473.mei');
    }).then((data) => {
      map.set(99, data);
      return $.get('./mei/CF-064.mei');
    }).then((data) => {
      map.set(100, data);
      return $.get('./mei/CF-471.mei');
    }).then((data) => {
      map.set(101, data);
      return $.get('./mei/CF-065.mei');
    }).then((data) => {
      map.set(102, data);
      return $.get('./mei/CF-470.mei');
    }).then((data) => {
      map.set(103, data);
      return $.get('./mei/CF-066.mei');
    }).then((data) => {
      map.set(104, data);
      /* return $.get('./mei/CF-469.mei');
    }).then((data) => {
      map.set(105, data); */
      return $.get('./mei/CF-067.mei');
    }).then((data) => {
      map.set(106, data);
      return $.get('./mei/CF-468.mei');
    }).then((data) => {
      map.set(107, data);
      return $.get('./mei/CF-068.mei');
    }).then((data) => {
      map.set(108, data);
      return $.get('./mei/CF-467.mei');
    }).then((data) => {
      map.set(109, data);
      /* return $.get('./mei/CF-069.mei');
    }).then((data) => {
      map.set(110, data); */
      /* return $.get('./mei/CF-466.mei');
    }).then((data) => {
      map.set(111, data); */
      return $.get('./mei/CF-070.mei');
    }).then((data) => {
      map.set(112, data);
      return $.get('./mei/CF-465.mei');
    }).then((data) => {
      map.set(113, data);
      return $.get('./mei/CF-071.mei');
    }).then((data) => {
      map.set(114, data);
      return $.get('./mei/CF-464.mei');
    }).then((data) => {
      map.set(115, data);
      return $.get('./mei/CF-072.mei');
    }).then((data) => {
      map.set(116, data);
      return $.get('./mei/CF-463.mei');
    }).then((data) => {
      map.set(117, data);
      return $.get('./mei/CF-073.mei');
    }).then((data) => {
      map.set(118, data);
      return $.get('./mei/CF-462.mei');
    }).then((data) => {
      map.set(119, data);
      return $.get('./mei/CF-074.mei');
    }).then((data) => {
      map.set(120, data);
      return $.get('./mei/CF-461.mei');
    }).then((data) => {
      map.set(121, data);
      return $.get('./mei/CF-075.mei');
    }).then((data) => {
      map.set(122, data);
      return $.get('./mei/CF-460.mei');
    }).then((data) => {
      map.set(123, data);
      return $.get('./mei/CF-076.mei');
    }).then((data) => {
      map.set(124, data);
      return $.get('./mei/CF-459.mei');
    }).then((data) => {
      map.set(125, data);
      return $.get('./mei/CF-077.mei');
    }).then((data) => {
      map.set(126, data);
      /* return $.get('./mei/CF-458.mei');
    }).then((data) => {
      map.set(127, data); */
      return $.get('./mei/CF-078.mei');
    }).then((data) => {
      map.set(128, data);
      return $.get('./mei/CF-457.mei');
    }).then((data) => {
      map.set(129, data);
      return $.get('./mei/CF-079.mei');
    }).then((data) => {
      map.set(130, data);
      return $.get('./mei/CF-456.mei');
    }).then((data) => {
      map.set(131, data);
      return $.get('./mei/CF-080.mei');
    }).then((data) => {
      map.set(132, data);
      return $.get('./mei/CF-455.mei');
    }).then((data) => {
      map.set(133, data);
      return $.get('./mei/CF-081.mei');
    }).then((data) => {
      map.set(134, data);
      return $.get('./mei/CF-454.mei');
    }).then((data) => {
      map.set(135, data);
      return $.get('./mei/CF-082.mei');
    }).then((data) => {
      map.set(136, data);
      return $.get('./mei/CF-453.mei');
    }).then((data) => {
      map.set(137, data);
      return $.get('./mei/CF-083.mei');
    }).then((data) => {
      map.set(138, data);
      return $.get('./mei/CF-452.mei');
    }).then((data) => {
      map.set(139, data);
      return $.get('./mei/CF-084.mei');
    }).then((data) => {
      map.set(140, data);
      return $.get('./mei/CF-451.mei');
    }).then((data) => {
      map.set(141, data);
      return $.get('./mei/CF-085.mei');
    }).then((data) => {
      map.set(142, data);
      return $.get('./mei/CF-450.mei');
    }).then((data) => {
      map.set(143, data);
      return $.get('./mei/CF-086.mei');
    }).then((data) => {
      map.set(144, data);
      return $.get('./mei/CF-449.mei');
    }).then((data) => {
      map.set(145, data);
      return $.get('./mei/CF-087.mei');
    }).then((data) => {
      map.set(146, data);
      return $.get('./mei/CF-448.mei');
    }).then((data) => {
      map.set(147, data);
      return $.get('./mei/CF-088.mei');
    }).then((data) => {
      map.set(148, data);
      /* return $.get('./mei/CF-447.mei');
    }).then((data) => {
      map.set(149, data); */
      return $.get('./mei/CF-089.mei');
    }).then((data) => {
      map.set(150, data);
      return $.get('./mei/CF-446.mei');
    }).then((data) => {
      map.set(151, data);
      return $.get('./mei/CF-090.mei');
    }).then((data) => {
      map.set(152, data);
      return $.get('./mei/CF-445.mei');
    }).then((data) => {
      map.set(153, data);
      return $.get('./mei/CF-092.mei');
    }).then((data) => {
      map.set(154, data);
      return $.get('./mei/CF-444.mei');
    }).then((data) => {
      map.set(155, data);
      return $.get('./mei/CF-093.mei');
    }).then((data) => {
      map.set(156, data);
      return $.get('./mei/CF-443.mei');
    }).then((data) => {
      map.set(157, data);
      /* return $.get('./mei/CF-094.mei');
    }).then((data) => {
      map.set(158, data); */
      return $.get('./mei/CF-442.mei');
    }).then((data) => {
      map.set(159, data);
      return $.get('./mei/CF-095.mei');
    }).then((data) => {
      map.set(160, data);
      return $.get('./mei/CF-441.mei');
    }).then((data) => {
      map.set(161, data);
      return $.get('./mei/CF-096.mei');
    }).then((data) => {
      map.set(162, data);
      return $.get('./mei/CF-440.mei');
    }).then((data) => {
      map.set(163, data);
      return $.get('./mei/CF-097.mei');
    }).then((data) => {
      map.set(164, data);
      return $.get('./mei/CF-439.mei');
    }).then((data) => {
      map.set(165, data);
      return $.get('./mei/CF-098.mei');
    }).then((data) => {
      map.set(166, data);
      return $.get('./mei/CF-438.mei');
    }).then((data) => {
      map.set(167, data);
      return $.get('./mei/CF-099.mei');
    }).then((data) => {
      map.set(168, data);
      return $.get('./mei/CF-437.mei');
    }).then((data) => {
      map.set(169, data);
      return $.get('./mei/CF-100.mei');
    }).then((data) => {
      map.set(170, data);
      return $.get('./mei/CF-436.mei');
    }).then((data) => {
      map.set(171, data);
      return $.get('./mei/CF-101.mei');
    }).then((data) => {
      map.set(172, data);
      return $.get('./mei/CF-435.mei');
    }).then((data) => {
      map.set(173, data);
      return $.get('./mei/CF-102.mei');
    }).then((data) => {
      map.set(174, data);
      return $.get('./mei/CF-434.mei');
    }).then((data) => {
      map.set(175, data);
      return $.get('./mei/CF-103.mei');
    }).then((data) => {
      map.set(176, data);
      return $.get('./mei/CF-433.mei');
    }).then((data) => {
      map.set(177, data);
      /* return $.get('./mei/CF-104.mei');
    }).then((data) => {
      map.set(178, data); */
      return $.get('./mei/CF-432.mei');
    }).then((data) => {
      map.set(179, data);
      return $.get('./mei/CF-105.mei');
    }).then((data) => {
      map.set(180, data);
      /* return $.get('./mei/CF-431.mei');
    }).then((data) => {
      map.set(181, data); */
      return $.get('./mei/CF-106.mei');
    }).then((data) => {
      map.set(182, data);
      return $.get('./mei/CF-430.mei');
    }).then((data) => {
      map.set(183, data);
      return $.get('./mei/CF-107.mei');
    }).then((data) => {
      map.set(184, data);
      /* return $.get('./mei/CF-429.mei');
    }).then((data) => {
      map.set(185, data); */
      return $.get('./mei/CF-108.mei');
    }).then((data) => {
      map.set(186, data);
      return $.get('./mei/CF-428.mei');
    }).then((data) => {
      map.set(187, data);
      return $.get('./mei/CF-109.mei');
    }).then((data) => {
      map.set(188, data);
      return $.get('./mei/CF-427.mei');
    }).then((data) => {
      map.set(189, data);
      return $.get('./mei/CF-110.mei');
    }).then((data) => {
      map.set(190, data);
      return $.get('./mei/CF-426.mei');
    }).then((data) => {
      map.set(191, data);
      return $.get('./mei/CF-111.mei');
    }).then((data) => {
      map.set(192, data);
      return $.get('./mei/CF-425.mei');
    }).then((data) => {
      map.set(193, data);
      return $.get('./mei/CF-112.mei');
    }).then((data) => {
      map.set(194, data);
      return $.get('./mei/CF-424.mei');
    }).then((data) => {
      map.set(195, data);
      return $.get('./mei/CF-113.mei');
    }).then((data) => {
      map.set(196, data);
      return $.get('./mei/CF-422.mei');
    }).then((data) => {
      map.set(197, data);
      return $.get('./mei/CF-114.mei');
    }).then((data) => {
      map.set(198, data);
      return $.get('./mei/CF-421.mei');
    }).then((data) => {
      map.set(199, data);
      return $.get('./mei/CF-117.mei');
    }).then((data) => {
      map.set(200, data);
      return $.get('./mei/CF-420.mei');
    }).then((data) => {
      map.set(201, data);
      return $.get('./mei/CF-118.mei');
    }).then((data) => {
      map.set(202, data);
      return $.get('./mei/CF-419.mei');
    }).then((data) => {
      map.set(203, data);
      return $.get('./mei/CF-119.mei');
    }).then((data) => {
      map.set(204, data);
      return $.get('./mei/CF-418.mei');
    }).then((data) => {
      map.set(205, data);
      return $.get('./mei/CF-120.mei');
    }).then((data) => {
      map.set(206, data);
      return $.get('./mei/CF-417.mei');
    }).then((data) => {
      map.set(207, data);
      return $.get('./mei/CF-121.mei');
    }).then((data) => {
      map.set(208, data);
      return $.get('./mei/CF-416.mei');
    }).then((data) => {
      map.set(209, data);
      return $.get('./mei/CF-122.mei');
    }).then((data) => {
      map.set(210, data);
      return $.get('./mei/CF-415.mei');
    }).then((data) => {
      map.set(211, data);
      return $.get('./mei/CF-123.mei');
    }).then((data) => {
      map.set(212, data);
      /* return $.get('./mei/CF-414.mei');
    }).then((data) => {
      map.set(213, data); */
      return $.get('./mei/CF-124.mei');
    }).then((data) => {
      map.set(214, data);
      return $.get('./mei/CF-413.mei');
    }).then((data) => {
      map.set(215, data);
      return $.get('./mei/CF-125.mei');
    }).then((data) => {
      map.set(216, data);
      /* return $.get('./mei/CF-412.mei');
    }).then((data) => {
      map.set(217, data); */
      return $.get('./mei/CF-126.mei');
    }).then((data) => {
      map.set(218, data);
      return $.get('./mei/CF-411.mei');
    }).then((data) => {
      map.set(219, data);
      return $.get('./mei/CF-127.mei');
    }).then((data) => {
      map.set(220, data);
      /* return $.get('./mei/CF-410.mei');
    }).then((data) => {
      map.set(221, data); */
      return $.get('./mei/CF-128.mei');
    }).then((data) => {
      map.set(222, data);
      return $.get('./mei/CF-409.mei');
    }).then((data) => {
      map.set(223, data);
      return $.get('./mei/CF-129.mei');
    }).then((data) => {
      map.set(224, data);
      return $.get('./mei/CF-408.mei');
    }).then((data) => {
      map.set(225, data);
      return $.get('./mei/CF-130.mei');
    }).then((data) => {
      map.set(226, data);
      return $.get('./mei/CF-407.mei');
    }).then((data) => {
      map.set(227, data);
      return $.get('./mei/CF-133.mei');
    }).then((data) => {
      map.set(228, data);
      return $.get('./mei/CF-406.mei');
    }).then((data) => {
      map.set(229, data);
      return $.get('./mei/CF-134.mei');
    }).then((data) => {
      map.set(230, data);
      return $.get('./mei/CF-405.mei');
    }).then((data) => {
      map.set(231, data);
      return $.get('./mei/CF-135.mei');
    }).then((data) => {
      map.set(232, data);
      return $.get('./mei/CF-404.mei');
    }).then((data) => {
      map.set(233, data);
      return $.get('./mei/CF-137.mei');
    }).then((data) => {
      map.set(234, data);
      return $.get('./mei/CF-402.mei');
    }).then((data) => {
      map.set(235, data);
      return $.get('./mei/CF-139.mei');
    }).then((data) => {
      map.set(236, data);
      return $.get('./mei/CF-401.mei');
    }).then((data) => {
      map.set(237, data);
      return $.get('./mei/CF-140.mei');
    }).then((data) => {
      map.set(238, data);
      return $.get('./mei/CF-400.mei');
    }).then((data) => {
      map.set(239, data);
      return $.get('./mei/CF-141.mei');
    }).then((data) => {
      map.set(240, data);
      return $.get('./mei/CF-399.mei');
    }).then((data) => {
      map.set(241, data);
      return $.get('./mei/CF-142.mei');
    }).then((data) => {
      map.set(242, data);
      return $.get('./mei/CF-398.mei');
    }).then((data) => {
      map.set(243, data);
      return $.get('./mei/CF-143.mei');
    }).then((data) => {
      map.set(244, data);
      return $.get('./mei/CF-397.mei');
    }).then((data) => {
      map.set(245, data);
      return $.get('./mei/CF-144.mei');
    }).then((data) => {
      map.set(246, data);
      return $.get('./mei/CF-396.mei');
    }).then((data) => {
      map.set(247, data);
      return $.get('./mei/CF-146.mei');
    }).then((data) => {
      map.set(248, data);
      return $.get('./mei/CF-394.mei');
    }).then((data) => {
      map.set(249, data);
      return $.get('./mei/CF-147.mei');
    }).then((data) => {
      map.set(250, data);
      return $.get('./mei/CF-392.mei');
    }).then((data) => {
      map.set(251, data);
      return $.get('./mei/CF-148.mei');
    }).then((data) => {
      map.set(252, data);
      return $.get('./mei/CF-391.mei');
    }).then((data) => {
      map.set(253, data);
      return $.get('./mei/CF-149.mei');
    }).then((data) => {
      map.set(254, data);
      return $.get('./mei/CF-390.mei');
    }).then((data) => {
      map.set(255, data);
      return $.get('./mei/CF-150.mei');
    }).then((data) => {
      map.set(256, data);
      return $.get('./mei/CF-389.mei');
    }).then((data) => {
      map.set(257, data);
      return $.get('./mei/CF-151.mei');
    }).then((data) => {
      map.set(258, data);
      return $.get('./mei/CF-388.mei');
    }).then((data) => {
      map.set(259, data);
      return $.get('./mei/CF-152.mei');
    }).then((data) => {
      map.set(260, data);
      return $.get('./mei/CF-387.mei');
    }).then((data) => {
      map.set(261, data);
      return $.get('./mei/CF-154.mei');
    }).then((data) => {
      map.set(262, data);
      return $.get('./mei/CF-384.mei');
    }).then((data) => {
      map.set(263, data);
      return $.get('./mei/CF-155.mei');
    }).then((data) => {
      map.set(264, data);
      return $.get('./mei/CF-382.mei');
    }).then((data) => {
      map.set(265, data);
      return $.get('./mei/CF-156.mei');
    }).then((data) => {
      map.set(266, data);
      return $.get('./mei/CF-381.mei');
    }).then((data) => {
      map.set(267, data);
      return $.get('./mei/CF-157.mei');
    }).then((data) => {
      map.set(268, data);
      return $.get('./mei/CF-380.mei');
    }).then((data) => {
      map.set(269, data);
      return $.get('./mei/CF-158.mei');
    }).then((data) => {
      map.set(270, data);
      return $.get('./mei/CF-379.mei');
    }).then((data) => {
      map.set(271, data);
      return $.get('./mei/CF-159.mei');
    }).then((data) => {
      map.set(272, data);
      return $.get('./mei/CF-378.mei');
    }).then((data) => {
      map.set(273, data);
      /* return $.get('./mei/CF-160.mei');
    }).then((data) => {
      map.set(274, data); */
      return $.get('./mei/CF-377.mei');
    }).then((data) => {
      map.set(275, data);
      return $.get('./mei/CF-161.mei');
    }).then((data) => {
      map.set(276, data);
      return $.get('./mei/CF-376.mei');
    }).then((data) => {
      map.set(277, data);
      return $.get('./mei/CF-162.mei');
    }).then((data) => {
      map.set(278, data);
      return $.get('./mei/CF-375.mei');
    }).then((data) => {
      map.set(279, data);
      return $.get('./mei/CF-163.mei');
    }).then((data) => {
      map.set(280, data);
      return $.get('./mei/CF-374.mei');
    }).then((data) => {
      map.set(281, data);
      return $.get('./mei/CF-164.mei');
    }).then((data) => {
      map.set(282, data);
      return $.get('./mei/CF-373.mei');
    }).then((data) => {
      map.set(283, data);
      return $.get('./mei/CF-165.mei');
    }).then((data) => {
      map.set(284, data);
      return $.get('./mei/CF-372.mei');
    }).then((data) => {
      map.set(285, data);
      return $.get('./mei/CF-166.mei');
    }).then((data) => {
      map.set(286, data);
      return $.get('./mei/CF-370.mei');
    }).then((data) => {
      map.set(287, data);
      return $.get('./mei/CF-167.mei');
    }).then((data) => {
      map.set(288, data);
      return $.get('./mei/CF-369.mei');
    }).then((data) => {
      map.set(289, data);
      return $.get('./mei/CF-168.mei');
    }).then((data) => {
      map.set(290, data);
      return $.get('./mei/CF-368.mei');
    }).then((data) => {
      map.set(291, data);
      return $.get('./mei/CF-169.mei');
    }).then((data) => {
      map.set(292, data);
      return $.get('./mei/CF-367.mei');
    }).then((data) => {
      map.set(293, data);
      return $.get('./mei/CF-170.mei');
    }).then((data) => {
      map.set(294, data);
      return $.get('./mei/CF-366.mei');
    }).then((data) => {
      map.set(295, data);
      return $.get('./mei/CF-172.mei');
    }).then((data) => {
      map.set(296, data);
      return $.get('./mei/CF-365.mei');
    }).then((data) => {
      map.set(297, data);
      return $.get('./mei/CF-173.mei');
    }).then((data) => {
      map.set(298, data);
      return $.get('./mei/CF-364.mei');
    }).then((data) => {
      map.set(299, data);
      return $.get('./mei/CF-174.mei');
    }).then((data) => {
      map.set(300, data);
      return $.get('./mei/CF-363.mei');
    }).then((data) => {
      map.set(301, data);
      /* return $.get('./mei/CF-175.mei');
    }).then((data) => {
      map.set(302, data); */
      return $.get('./mei/CF-362.mei');
    }).then((data) => {
      map.set(303, data);
      return $.get('./mei/CF-176.mei');
    }).then((data) => {
      map.set(304, data);
      return $.get('./mei/CF-361.mei');
    }).then((data) => {
      map.set(305, data);
      return $.get('./mei/CF-177.mei');
    }).then((data) => {
      map.set(306, data);
      return $.get('./mei/CF-360.mei');
    }).then((data) => {
      map.set(307, data);
      return $.get('./mei/CF-178.mei');
    }).then((data) => {
      map.set(308, data);
      return $.get('./mei/CF-359.mei');
    }).then((data) => {
      map.set(309, data);
      return $.get('./mei/CF-179.mei');
    }).then((data) => {
      map.set(310, data);
      return $.get('./mei/CF-358.mei');
    }).then((data) => {
      map.set(311, data);
      return $.get('./mei/CF-180.mei');
    }).then((data) => {
      map.set(312, data);
      return $.get('./mei/CF-356.mei');
    }).then((data) => {
      map.set(313, data);
      return $.get('./mei/CF-181.mei');
    }).then((data) => {
      map.set(314, data);
      return $.get('./mei/CF-355.mei');
    }).then((data) => {
      map.set(315, data);
      return $.get('./mei/CF-182.mei');
    }).then((data) => {
      map.set(316, data);
      return $.get('./mei/CF-354.mei');
    }).then((data) => {
      map.set(317, data);
      return $.get('./mei/CF-183.mei');
    }).then((data) => {
      map.set(318, data);
      return $.get('./mei/CF-349.mei');
    }).then((data) => {
      map.set(319, data);
      return $.get('./mei/CF-184.mei');
    }).then((data) => {
      map.set(320, data);
      return $.get('./mei/CF-348.mei');
    }).then((data) => {
      map.set(321, data);
      return $.get('./mei/CF-185.mei');
    }).then((data) => {
      map.set(322, data);
      return $.get('./mei/CF-347.mei');
    }).then((data) => {
      map.set(323, data);
      return $.get('./mei/CF-186.mei');
    }).then((data) => {
      map.set(324, data);
      return $.get('./mei/CF-346.mei');
    }).then((data) => {
      map.set(325, data);
      return $.get('./mei/CF-187.mei');
    }).then((data) => {
      map.set(326, data);
      return $.get('./mei/CF-345.mei');
    }).then((data) => {
      map.set(327, data);
      return $.get('./mei/CF-188.mei');
    }).then((data) => {
      map.set(328, data);
      return $.get('./mei/CF-344.mei');
    }).then((data) => {
      map.set(329, data);
      return $.get('./mei/CF-189.mei');
    }).then((data) => {
      map.set(330, data);
      return $.get('./mei/CF-343.mei');
    }).then((data) => {
      map.set(331, data);
      /* return $.get('./mei/CF-190.mei');
    }).then((data) => {
      map.set(332, data); */
      return $.get('./mei/CF-342.mei');
    }).then((data) => {
      map.set(333, data);
      return $.get('./mei/CF-191.mei');
    }).then((data) => {
      map.set(334, data);
      return $.get('./mei/CF-341.mei');
    }).then((data) => {
      map.set(335, data);
      return $.get('./mei/CF-192.mei');
    }).then((data) => {
      map.set(336, data);
      return $.get('./mei/CF-340.mei');
    }).then((data) => {
      map.set(337, data);
      return $.get('./mei/CF-193.mei');
    }).then((data) => {
      map.set(338, data);
      return $.get('./mei/CF-339.mei');
    }).then((data) => {
      map.set(339, data);
      return $.get('./mei/CF-194.mei');
    }).then((data) => {
      map.set(340, data);
      return $.get('./mei/CF-338.mei');
    }).then((data) => {
      map.set(341, data);
      return $.get('./mei/CF-195.mei');
    }).then((data) => {
      map.set(342, data);
      return $.get('./mei/CF-337.mei');
    }).then((data) => {
      map.set(343, data);
      return $.get('./mei/CF-196.mei');
    }).then((data) => {
      map.set(344, data);
      return $.get('./mei/CF-336.mei');
    }).then((data) => {
      map.set(345, data);
      return $.get('./mei/CF-197.mei');
    }).then((data) => {
      map.set(346, data);
      return $.get('./mei/CF-334.mei');
    }).then((data) => {
      map.set(347, data);
      return $.get('./mei/CF-199.mei');
    }).then((data) => {
      map.set(348, data);
      return $.get('./mei/CF-333.mei');
    }).then((data) => {
      map.set(349, data);
      return $.get('./mei/CF-200.mei');
    }).then((data) => {
      map.set(350, data);
      return $.get('./mei/CF-332.mei');
    }).then((data) => {
      map.set(351, data);
      return $.get('./mei/CF-201.mei');
    }).then((data) => {
      map.set(352, data);
      return $.get('./mei/CF-331.mei');
    }).then((data) => {
      map.set(353, data);
      return $.get('./mei/CF-202.mei');
    }).then((data) => {
      map.set(354, data);
      return $.get('./mei/CF-330.mei');
    }).then((data) => {
      map.set(355, data);
      return $.get('./mei/CF-203.mei');
    }).then((data) => {
      map.set(356, data);
      /* return $.get('./mei/CF-328.mei');
    }).then((data) => {
      map.set(357, data); */
      /* return $.get('./mei/CF-204.mei');
    }).then((data) => {
      map.set(358, data); */
      return $.get('./mei/CF-329.mei');
    }).then((data) => {
      map.set(359, data);
      return $.get('./mei/CF-206.mei');
    }).then((data) => {
      map.set(360, data);
      return $.get('./mei/CF-327.mei');
    }).then((data) => {
      map.set(361, data);
      return $.get('./mei/CF-207.mei');
    }).then((data) => {
      map.set(362, data);
      return $.get('./mei/CF-326.mei');
    }).then((data) => {
      map.set(363, data);
      return $.get('./mei/CF-208.mei');
    }).then((data) => {
      map.set(364, data);
      return $.get('./mei/CF-324.mei');
    }).then((data) => {
      map.set(365, data);
      return $.get('./mei/CF-209.mei');
    }).then((data) => {
      map.set(366, data);
      return $.get('./mei/CF-323.mei');
    }).then((data) => {
      map.set(367, data);
      return $.get('./mei/CF-210.mei');
    }).then((data) => {
      map.set(368, data);
      return $.get('./mei/CF-322.mei');
    }).then((data) => {
      map.set(369, data);
      return $.get('./mei/CF-211.mei');
    }).then((data) => {
      map.set(370, data);
      return $.get('./mei/CF-321.mei');
    }).then((data) => {
      map.set(371, data);
      return $.get('./mei/CF-212.mei');
    }).then((data) => {
      map.set(372, data);
      return $.get('./mei/CF-320.mei');
    }).then((data) => {
      map.set(373, data);
      return $.get('./mei/CF-213.mei');
    }).then((data) => {
      map.set(374, data);
      return $.get('./mei/CF-319.mei');
    }).then((data) => {
      map.set(375, data);
      return $.get('./mei/CF-214.mei');
    }).then((data) => {
      map.set(376, data);
      return $.get('./mei/CF-318.mei');
    }).then((data) => {
      map.set(377, data);
      return $.get('./mei/CF-215.mei');
    }).then((data) => {
      map.set(378, data);
      return $.get('./mei/CF-317.mei');
    }).then((data) => {
      map.set(379, data);
      return $.get('./mei/CF-216.mei');
    }).then((data) => {
      map.set(380, data);
      return $.get('./mei/CF-316.mei');
    }).then((data) => {
      map.set(381, data);
      return $.get('./mei/CF-219.mei');
    }).then((data) => {
      map.set(382, data);
      return $.get('./mei/CF-315.mei');
    }).then((data) => {
      map.set(383, data);
      return $.get('./mei/CF-220.mei');
    }).then((data) => {
      map.set(384, data);
      return $.get('./mei/CF-314.mei');
    }).then((data) => {
      map.set(385, data);
      return $.get('./mei/CF-221.mei');
    }).then((data) => {
      map.set(386, data);
      return $.get('./mei/CF-313.mei');
    }).then((data) => {
      map.set(387, data);
      return $.get('./mei/CF-222.mei');
    }).then((data) => {
      map.set(388, data);
      return $.get('./mei/CF-312.mei');
    }).then((data) => {
      map.set(389, data);
      return $.get('./mei/CF-223.mei');
    }).then((data) => {
      map.set(390, data);
      return $.get('./mei/CF-224.mei');
    }).then((data) => {
      map.set(391, data);
      /* return $.get('./mei/CF-310.mei');
    }).then((data) => {
      map.set(392, data); */
      return $.get('./mei/CF-225.mei');
    }).then((data) => {
      map.set(393, data);
      return $.get('./mei/CF-309.mei');
    }).then((data) => {
      map.set(394, data);
      return $.get('./mei/CF-226.mei');
    }).then((data) => {
      map.set(395, data);
      return $.get('./mei/CF-307.mei');
    }).then((data) => {
      map.set(396, data);
      return $.get('./mei/CF-227.mei');
    }).then((data) => {
      map.set(397, data);
      return $.get('./mei/CF-306.mei');
    }).then((data) => {
      map.set(398, data);
      return $.get('./mei/CF-228.mei');
    }).then((data) => {
      map.set(399, data);
      return $.get('./mei/CF-305.mei');
    }).then((data) => {
      map.set(400, data);
      return $.get('./mei/CF-229.mei');
    }).then((data) => {
      map.set(401, data);
      return $.get('./mei/CF-304.mei');
    }).then((data) => {
      map.set(402, data);
      return $.get('./mei/CF-230.mei');
    }).then((data) => {
      map.set(403, data);
      return $.get('./mei/CF-303.mei');
    }).then((data) => {
      map.set(404, data);
      return $.get('./mei/CF-231.mei');
    }).then((data) => {
      map.set(405, data);
      return $.get('./mei/CF-302.mei');
    }).then((data) => {
      map.set(406, data);
      return $.get('./mei/CF-232.mei');
    }).then((data) => {
      map.set(407, data);
      return $.get('./mei/CF-301.mei');
    }).then((data) => {
      map.set(408, data);
      return $.get('./mei/CF-233.mei');
    }).then((data) => {
      map.set(409, data);
      return $.get('./mei/CF-300.mei');
    }).then((data) => {
      map.set(410, data);
      return $.get('./mei/CF-234.mei');
    }).then((data) => {
      map.set(411, data);
      return $.get('./mei/CF-299.mei');
    }).then((data) => {
      map.set(412, data);
      return $.get('./mei/CF-235.mei');
    }).then((data) => {
      map.set(413, data);
      return $.get('./mei/CF-298.mei');
    }).then((data) => {
      map.set(414, data);
      return $.get('./mei/CF-236.mei');
    }).then((data) => {
      map.set(415, data);
      return $.get('./mei/CF-297.mei');
    }).then((data) => {
      map.set(416, data);
      return $.get('./mei/CF-237.mei');
    }).then((data) => {
      map.set(417, data);
      return $.get('./mei/CF-240.mei');
    }).then((data) => {
      map.set(418, data);
      return $.get('./mei/CF-293.mei');
    }).then((data) => {
      map.set(419, data);
      return $.get('./mei/CF-241.mei');
    }).then((data) => {
      map.set(420, data);
      return $.get('./mei/CF-292.mei');
    }).then((data) => {
      map.set(421, data);
      return $.get('./mei/CF-242.mei');
    }).then((data) => {
      map.set(422, data);
      return $.get('./mei/CF-291.mei');
    }).then((data) => {
      map.set(423, data);
      return $.get('./mei/CF-243.mei');
    }).then((data) => {
      map.set(424, data);
      return $.get('./mei/CF-290.mei');
    }).then((data) => {
      map.set(425, data);
      return $.get('./mei/CF-244.mei');
    }).then((data) => {
      map.set(426, data);
      return $.get('./mei/CF-289.mei');
    }).then((data) => {
      map.set(427, data);
      return $.get('./mei/CF-245.mei');
    }).then((data) => {
      map.set(428, data);
      return $.get('./mei/CF-288.mei');
    }).then((data) => {
      map.set(429, data);
      return $.get('./mei/CF-246.mei');
    }).then((data) => {
      map.set(430, data);
      return $.get('./mei/CF-287.mei');
    }).then((data) => {
      map.set(431, data);
      return $.get('./mei/CF-247.mei');
    }).then((data) => {
      map.set(432, data);
      return $.get('./mei/CF-286.mei');
    }).then((data) => {
      map.set(433, data);
      return $.get('./mei/CF-248.mei');
    }).then((data) => {
      map.set(434, data);
      return $.get('./mei/CF-285.mei');
    }).then((data) => {
      map.set(435, data);
      return $.get('./mei/CF-249.mei');
    }).then((data) => {
      map.set(436, data);
      return $.get('./mei/CF-284.mei');
    }).then((data) => {
      map.set(437, data);
      /* return $.get('./mei/CF-250.mei');
    }).then((data) => {
      map.set(438, data); */
      return $.get('./mei/CF-283.mei');
    }).then((data) => {
      map.set(439, data);
      return $.get('./mei/CF-251.mei');
    }).then((data) => {
      map.set(440, data);
      return $.get('./mei/CF-282.mei');
    }).then((data) => {
      map.set(441, data);
      return $.get('./mei/CF-252.mei');
    }).then((data) => {
      map.set(442, data);
      return $.get('./mei/CF-281.mei');
    }).then((data) => {
      map.set(443, data);
      return $.get('./mei/CF-253.mei');
    }).then((data) => {
      map.set(444, data);
      return $.get('./mei/CF-280.mei');
    }).then((data) => {
      map.set(445, data);
      return $.get('./mei/CF-254.mei');
    }).then((data) => {
      map.set(446, data);
      return $.get('./mei/CF-279.mei');
    }).then((data) => {
      map.set(447, data);
      return $.get('./mei/CF-255.mei');
    }).then((data) => {
      map.set(448, data);
      return $.get('./mei/CF-278.mei');
    }).then((data) => {
      map.set(449, data);
      return $.get('./mei/CF-257.mei');
    }).then((data) => {
      map.set(450, data);
      return $.get('./mei/CF-277.mei');
    }).then((data) => {
      map.set(451, data);
      return $.get('./mei/CF-258.mei');
    }).then((data) => {
      map.set(452, data);
      return $.get('./mei/CF-276.mei');
    }).then((data) => {
      map.set(453, data);
      return $.get('./mei/CF-260.mei');
    }).then((data) => {
      map.set(454, data);
      return $.get('./mei/CF-275.mei');
    }).then((data) => {
      map.set(455, data);
      return $.get('./mei/CF-261.mei');
    }).then((data) => {
      map.set(456, data);
      return $.get('./mei/CF-274.mei');
    }).then((data) => {
      map.set(457, data);
      return $.get('./mei/CF-262.mei');
    }).then((data) => {
      map.set(458, data);
      return $.get('./mei/CF-273.mei');
    }).then((data) => {
      map.set(459, data);
      return $.get('./mei/CF-263.mei');
    }).then((data) => {
      map.set(460, data);
      return $.get('./mei/CF-272.mei');
    }).then((data) => {
      map.set(461, data);
      return $.get('./mei/CF-264.mei');
    }).then((data) => {
      map.set(462, data);
      return $.get('./mei/CF-271.mei');
    }).then((data) => {
      map.set(463, data);

      params.options.meiMap = map;
      var view = new NeonView(params);
      view.start();
    }).catch((err) => { console.error(err); });
  }
} else if (mode === 'user-page') {
  let db = new PouchDb('neon-temporary');
  let params = {
    mode: 'single',
    options: {
      name: 'User MEI'
    },
    View: SingleView,
    Edit: SingleEditMode,
    Display: DisplayPanel,
    Info: InfoModule,
    TextView: TextView
  };
  db.get('mei').then((doc) => {
    map.set(0, doc.data);
    params.options.meiMap = map;
    return db.get('img');
  }).then((doc) => {
    params.options.image = doc.data;
    var view = new NeonView(params);
    view.start();
  }).catch((err) => {
    console.error(err);
  });
} else {
  console.log('None of the above');
}

/*
var view;
if (mei === null) {
  view = new NeonView({
    meifile: '',
    bgimg: '',
    mode: 'local',
    raw: 'true'
  });
} else {
  view = new NeonView({
    meifile: './mei/' + mei + '.mei',
    bgimg: './img/' + mei + '.png',
    mode: 'pages'
  });
}

view.start();
*/

function getGetParam (paramName) {
  let result = null;

  let tmp = [];
  window.location.search
    .substr(1)
    .split('&')
    .forEach((item) => {
      tmp = item.split('=');
      if (tmp[0] === paramName) {
        result = decodeURIComponent(tmp[1]);
      }
    });
  return result;
}
