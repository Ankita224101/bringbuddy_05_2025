-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2025 at 09:01 AM
-- Server version: 8.0.42
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bring_your_buddy`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `email`, `password`, `createdAt`) VALUES
(1, 'admin', 'admin@gmail.com', '1234', '2025-04-29 07:48:22');

-- --------------------------------------------------------

--
-- Table structure for table `agents`
--

CREATE TABLE `agents` (
  `id` int NOT NULL,
  `name` varchar(500) DEFAULT NULL,
  `profile_img` varchar(1000) NOT NULL DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  `email` varchar(500) DEFAULT NULL,
  `students` int DEFAULT '0',
  `address` varchar(1000) DEFAULT NULL,
  `country_code` int DEFAULT NULL,
  `country_id` int DEFAULT NULL,
  `phone_number` varchar(500) DEFAULT NULL,
  `id_proof` varchar(500) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `password` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `otp` int DEFAULT NULL,
  `otp_expires_at` date DEFAULT NULL,
  `commission` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `agents`
--

INSERT INTO `agents` (`id`, `name`, `profile_img`, `email`, `students`, `address`, `country_code`, `country_id`, `phone_number`, `id_proof`, `status`, `password`, `created_at`, `otp`, `otp_expires_at`, `commission`) VALUES
(1, 'Bitu', '/agents/profile/1746616643174-dummy_logo.png', 'sharmanitin.mcl@gmail.com', 0, 'hbsau  ewygf', 214, 214, '9015076296', '/agents/documents/1746255235295-2too4x1-bachelor.pdf', 0, '$2b$10$mJpcbk9J/kXB.WOaWZEBQ.1QSF1zSy85p1Crb4PCIh.4ptOLChFy.', '2025-05-03 06:53:55', 8772, '2025-05-03', 2000),
(2, 'Titu', '/agents/profile/1746616643174-dummy_logo.png', 'sharmanitin1.mcl@gmail.com', 0, 'hbsau  ewygf', 214, 214, '9015076296', '/agents/documents/1746255235295-2too4x1-bachelor.pdf', 0, '$2b$10$mJpcbk9J/kXB.WOaWZEBQ.1QSF1zSy85p1Crb4PCIh.4ptOLChFy.', '2025-05-03 06:53:55', 8772, '2025-05-03', 2131);

-- --------------------------------------------------------

--
-- Table structure for table `airport_pickup`
--

CREATE TABLE `airport_pickup` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `photo_document` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `airport_pickup`
--

INSERT INTO `airport_pickup` (`id`, `user_id`, `photo_document`, `created_at`) VALUES
(3, 96, '/airport-images/1745390497675-photo_document-1oth-dmc.webp', '2025-04-23 06:36:04'),
(4, 105, '/airport-images/1746602187361-photo_document-Screenshot 2025-05-07 103201.png', '2025-05-07 07:16:27');

-- --------------------------------------------------------

--
-- Table structure for table `bachelor_marks`
--

CREATE TABLE `bachelor_marks` (
  `id` varchar(500) DEFAULT NULL,
  `degree` varchar(500) DEFAULT NULL,
  `marks` varchar(500) DEFAULT NULL,
  `grade` varchar(500) DEFAULT NULL,
  `percentage` varchar(500) DEFAULT NULL,
  `marks_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bachelor_marks`
--

INSERT INTO `bachelor_marks` (`id`, `degree`, `marks`, `grade`, `percentage`, `marks_id`) VALUES
('4a2a2f4e-a4a2-48f7-9117-6422896d1e8a', 'b.tech', '12', 'A', '12', 1),
('0af266e9-8678-484c-a758-a7c67b04ce5f', 'degree', '123', 'B', '', 2);

-- --------------------------------------------------------

--
-- Table structure for table `commission`
--

CREATE TABLE `commission` (
  `user_id` int DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL,
  `payment_reciept` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `commission`
--

INSERT INTO `commission` (`user_id`, `amount`, `status`, `id`, `payment_reciept`) VALUES
(120, 12, 1, 4, '/documents/1747660702509-a1vjtsj-10th_dmc.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `embassy_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `embassy_email`) VALUES
(202, 'Afghanistan', NULL),
(203, 'Albania', NULL),
(204, 'Algeria', NULL),
(205, 'Andorra', NULL),
(206, 'Angola', NULL),
(207, 'Antigua and Barbuda', NULL),
(208, 'Argentina', NULL),
(209, 'Armenia', NULL),
(210, 'Australia', NULL),
(211, 'Austria', NULL),
(212, 'Azerbaijan', NULL),
(213, 'Bahamas', NULL),
(214, 'Bahrain', NULL),
(215, 'Bangladesh', NULL),
(216, 'Barbados', NULL),
(217, 'Belarus', NULL),
(218, 'Belgium', NULL),
(219, 'Belize', NULL),
(220, 'Benin', NULL),
(221, 'Bhutan', NULL),
(222, 'Bolivia', NULL),
(223, 'Bosnia and Herzegovina', NULL),
(224, 'Botswana', NULL),
(225, 'Brazil', NULL),
(226, 'Brunei', NULL),
(227, 'Bulgaria', NULL),
(228, 'Burkina Faso', NULL),
(229, 'Burundi', NULL),
(230, 'Cabo Verde', NULL),
(231, 'Cambodia', NULL),
(232, 'Cameroon', NULL),
(233, 'Canada', NULL),
(234, 'Central African Republic', NULL),
(235, 'Chad', NULL),
(236, 'Chile', NULL),
(237, 'China', NULL),
(238, 'Colombia', NULL),
(239, 'Comoros', NULL),
(240, 'Congo (Congo-Brazzaville)', NULL),
(241, 'Costa Rica', NULL),
(242, 'Croatia', NULL),
(243, 'Cuba', NULL),
(244, 'Cyprus', NULL),
(245, 'Czechia', NULL),
(246, 'Democratic Republic of the Congo', NULL),
(247, 'Denmark', NULL),
(248, 'Djibouti', NULL),
(249, 'Dominica', NULL),
(250, 'Dominican Republic', NULL),
(251, 'Ecuador', NULL),
(252, 'Egypt', NULL),
(253, 'El Salvador', NULL),
(254, 'Equatorial Guinea', NULL),
(255, 'Eritrea', NULL),
(256, 'Estonia', NULL),
(257, 'Eswatini', NULL),
(258, 'Ethiopia', NULL),
(259, 'Fiji', NULL),
(260, 'Finland', NULL),
(261, 'France', NULL),
(262, 'Gabon', NULL),
(263, 'Gambia', NULL),
(264, 'Georgia', NULL),
(265, 'Germany', NULL),
(266, 'Ghana', NULL),
(267, 'Greece', NULL),
(268, 'Grenada', NULL),
(269, 'Guatemala', NULL),
(270, 'Guinea', NULL),
(271, 'Guinea-Bissau', NULL),
(272, 'Guyana', NULL),
(273, 'Haiti', NULL),
(274, 'Honduras', NULL),
(275, 'Hungary', NULL),
(276, 'Iceland', NULL),
(277, 'India', NULL),
(278, 'Indonesia', NULL),
(279, 'Iran', NULL),
(280, 'Iraq', NULL),
(281, 'Ireland', NULL),
(282, 'Israel', NULL),
(283, 'Italy', NULL),
(284, 'Jamaica', NULL),
(285, 'Japan', NULL),
(286, 'Jordan', NULL),
(287, 'Kazakhstan', NULL),
(288, 'Kenya', NULL),
(289, 'Kiribati', NULL),
(290, 'Kuwait', NULL),
(291, 'Kyrgyzstan', NULL),
(292, 'Laos', NULL),
(293, 'Latvia', NULL),
(294, 'Lebanon', NULL),
(295, 'Lesotho', NULL),
(296, 'Liberia', NULL),
(297, 'Libya', NULL),
(298, 'Liechtenstein', NULL),
(299, 'Lithuania', NULL),
(300, 'Luxembourg', NULL),
(301, 'Madagascar', NULL),
(302, 'Malawi', NULL),
(303, 'Malaysia', NULL),
(304, 'Maldives', NULL),
(305, 'Mali', NULL),
(306, 'Malta', NULL),
(307, 'Marshall Islands', NULL),
(308, 'Mauritania', NULL),
(309, 'Mauritius', NULL),
(310, 'Mexico', NULL),
(311, 'Micronesia', NULL),
(312, 'Moldova', NULL),
(313, 'Monaco', NULL),
(314, 'Mongolia', NULL),
(315, 'Montenegro', NULL),
(316, 'Morocco', NULL),
(317, 'Mozambique', NULL),
(318, 'Myanmar', NULL),
(319, 'Namibia', NULL),
(320, 'Nauru', NULL),
(321, 'Nepal', NULL),
(322, 'Netherlands', NULL),
(323, 'New Zealand', NULL),
(324, 'Nicaragua', NULL),
(325, 'Niger', NULL),
(326, 'Nigeria', NULL),
(327, 'North Korea', NULL),
(328, 'North Macedonia', NULL),
(329, 'Norway', NULL),
(330, 'Oman', NULL),
(331, 'Pakistan', NULL),
(332, 'Palau', NULL),
(333, 'Palestine', NULL),
(334, 'Panama', NULL),
(335, 'Papua New Guinea', NULL),
(336, 'Paraguay', NULL),
(337, 'Peru', NULL),
(338, 'Philippines', NULL),
(339, 'Poland', NULL),
(340, 'Portugal', NULL),
(341, 'Qatar', NULL),
(342, 'Romania', NULL),
(343, 'Russia', NULL),
(344, 'Rwanda', NULL),
(345, 'Saint Kitts and Nevis', NULL),
(346, 'Saint Lucia', NULL),
(347, 'Saint Vincent and the Grenadines', NULL),
(348, 'Samoa', NULL),
(349, 'San Marino', NULL),
(350, 'Sao Tome and Principe', NULL),
(351, 'Saudi Arabia', NULL),
(352, 'Senegal', NULL),
(353, 'Serbia', NULL),
(354, 'Seychelles', NULL),
(355, 'Sierra Leone', NULL),
(356, 'Singapore', NULL),
(357, 'Slovakia', NULL),
(358, 'Slovenia', NULL),
(359, 'Solomon Islands', NULL),
(360, 'Somalia', NULL),
(361, 'South Africa', NULL),
(362, 'South Korea', NULL),
(363, 'South Sudan', NULL),
(364, 'Spain', NULL),
(365, 'Sri Lanka', NULL),
(366, 'Sudan', NULL),
(367, 'Suriname', NULL),
(368, 'Sweden', NULL),
(369, 'Switzerland', NULL),
(370, 'Syria', NULL),
(371, 'Tajikistan', NULL),
(372, 'Tanzania', NULL),
(373, 'Thailand', NULL),
(374, 'Timor-Leste', NULL),
(375, 'Togo', NULL),
(376, 'Tonga', NULL),
(377, 'Trinidad and Tobago', NULL),
(378, 'Tunisia', NULL),
(379, 'Turkey', NULL),
(380, 'Turkmenistan', NULL),
(381, 'Tuvalu', NULL),
(382, 'Uganda', NULL),
(383, 'Ukraine', NULL),
(384, 'United Arab Emirates', NULL),
(385, 'United Kingdom', NULL),
(386, 'United States', NULL),
(387, 'Uruguay', NULL),
(388, 'Uzbekistan', NULL),
(389, 'Vanuatu', NULL),
(390, 'Vatican City', NULL),
(391, 'Venezuela', NULL),
(392, 'Vietnam', NULL),
(393, 'Yemen', NULL),
(394, 'Zambia', NULL),
(395, 'Zimbabwe', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `country_code`
--

CREATE TABLE `country_code` (
  `code_id` int NOT NULL,
  `phone_code` varchar(15) DEFAULT NULL,
  `country_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `country_code`
--

INSERT INTO `country_code` (`code_id`, `phone_code`, `country_id`) VALUES
(202, '+93', 202),
(203, '+355', 203),
(204, '+213', 204),
(205, '+376', 205),
(206, '+244', 206),
(207, '+1-268', 207),
(208, '+54', 208),
(209, '+374', 209),
(210, '+61', 210),
(211, '+43', 211),
(212, '+994', 212),
(213, '+1-242', 213),
(214, '+973', 214),
(215, '+880', 215),
(216, '+1-246', 216),
(217, '+375', 217),
(218, '+32', 218),
(219, '+501', 219),
(220, '+229', 220),
(221, '+975', 221),
(222, '+591', 222),
(223, '+387', 223),
(224, '+267', 224),
(225, '+55', 225),
(226, '+673', 226),
(227, '+359', 227),
(228, '+226', 228),
(229, '+257', 229),
(230, '+238', 230),
(231, '+855', 231),
(232, '+237', 232),
(233, '+1', 233),
(234, '+236', 234),
(235, '+235', 235),
(236, '+56', 236),
(237, '+86', 237),
(238, '+57', 238),
(239, '+269', 239),
(240, '+242', 240),
(241, '+506', 241),
(242, '+385', 242),
(243, '+53', 243),
(244, '+357', 244),
(245, '+420', 245),
(246, '+243', 246),
(247, '+45', 247),
(248, '+253', 248),
(249, '+1-767', 249),
(250, '+1-809', 250),
(251, '+593', 251),
(252, '+20', 252),
(253, '+503', 253),
(254, '+240', 254),
(255, '+291', 255),
(256, '+372', 256),
(257, '+268', 257),
(258, '+251', 258),
(259, '+679', 259),
(260, '+358', 260),
(261, '+33', 261),
(262, '+241', 262),
(263, '+220', 263),
(264, '+995', 264),
(265, '+49', 265),
(266, '+233', 266),
(267, '+30', 267),
(268, '+1-473', 268),
(269, '+502', 269),
(270, '+224', 270),
(271, '+245', 271),
(272, '+592', 272),
(273, '+509', 273),
(274, '+504', 274),
(275, '+36', 275),
(276, '+354', 276),
(277, '+91', 277),
(278, '+62', 278),
(279, '+98', 279),
(280, '+964', 280),
(281, '+353', 281),
(282, '+972', 282),
(283, '+39', 283),
(284, '+1-876', 284),
(285, '+81', 285),
(286, '+962', 286),
(287, '+7', 287),
(288, '+254', 288),
(289, '+686', 289),
(290, '+965', 290),
(291, '+996', 291),
(292, '+856', 292),
(293, '+371', 293),
(294, '+961', 294),
(295, '+266', 295),
(296, '+231', 296),
(297, '+218', 297),
(298, '+423', 298),
(299, '+370', 299),
(300, '+352', 300),
(301, '+261', 301),
(302, '+265', 302),
(303, '+60', 303),
(304, '+960', 304),
(305, '+223', 305),
(306, '+356', 306),
(307, '+692', 307),
(308, '+222', 308),
(309, '+230', 309),
(310, '+52', 310),
(311, '+691', 311),
(312, '+373', 312),
(313, '+377', 313),
(314, '+976', 314),
(315, '+382', 315),
(316, '+212', 316),
(317, '+258', 317),
(318, '+95', 318),
(319, '+264', 319),
(320, '+674', 320),
(321, '+977', 321),
(322, '+31', 322),
(323, '+64', 323),
(324, '+505', 324),
(325, '+227', 325),
(326, '+234', 326),
(327, '+850', 327),
(328, '+389', 328),
(329, '+47', 329),
(330, '+968', 330),
(331, '+92', 331),
(332, '+680', 332),
(333, '+970', 333),
(334, '+507', 334),
(335, '+675', 335),
(336, '+595', 336),
(337, '+51', 337),
(338, '+63', 338),
(339, '+48', 339),
(340, '+351', 340),
(341, '+974', 341),
(342, '+40', 342),
(343, '+7', 343),
(344, '+250', 344),
(345, '+1-869', 345),
(346, '+1-758', 346),
(347, '+1-784', 347),
(348, '+685', 348),
(349, '+378', 349),
(350, '+239', 350),
(351, '+966', 351),
(352, '+221', 352),
(353, '+381', 353),
(354, '+248', 354),
(355, '+232', 355),
(356, '+65', 356),
(357, '+421', 357),
(358, '+386', 358),
(359, '+677', 359),
(360, '+252', 360),
(361, '+27', 361),
(362, '+82', 362),
(363, '+211', 363),
(364, '+34', 364),
(365, '+94', 365),
(366, '+249', 366),
(367, '+597', 367),
(368, '+46', 368),
(369, '+41', 369),
(370, '+963', 370),
(371, '+992', 371),
(372, '+255', 372),
(373, '+66', 373),
(374, '+670', 374),
(375, '+228', 375),
(376, '+676', 376),
(377, '+1-868', 377),
(378, '+216', 378),
(379, '+90', 379),
(380, '+993', 380),
(381, '+688', 381),
(382, '+256', 382),
(383, '+380', 383),
(384, '+971', 384),
(385, '+44', 385),
(386, '+1', 386),
(387, '+598', 387),
(388, '+998', 388),
(389, '+678', 389),
(390, '+379', 390),
(391, '+58', 391),
(392, '+84', 392),
(393, '+967', 393),
(394, '+260', 394),
(395, '+263', 395);

-- --------------------------------------------------------

--
-- Table structure for table `course_trades`
--

CREATE TABLE `course_trades` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `program_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_trades`
--

INSERT INTO `course_trades` (`id`, `name`, `program_id`) VALUES
(88, 'Bachelor of Technology in Computer Science (BTech)', 66),
(89, 'Bachelor of Technology in Mechanical Engineering (BTech)', 66),
(90, 'Bachelor of Technology in Civil Engineering (BTech)', 66),
(91, 'Bachelor of Technology in Electrical Engineering (BTech)', 66),
(92, 'Bachelor of Technology in Information Technology (BTech)', 66),
(93, 'Bachelor of Technology in Automobile Engineering (BTech)', 66),
(94, 'Master of Technology in Computer Science (MTech)', 67),
(95, 'Master of Technology in Mechanical Engineering (MTech)', 67),
(96, 'Master of Technology in Civil Engineering (MTech)', 67),
(97, 'Master of Technology in Electrical Engineering (MTech)', 67),
(98, 'Master of Technology in Information Technology (MTech)', 67),
(99, 'Master of Technology in Structural Engineering (MTech)', 67),
(100, 'Doctor of Philosophy in Computer Science (PhD)', 68),
(101, 'Doctor of Philosophy in Mechanical Engineering (PhD)', 68),
(102, 'Doctor of Philosophy in Civil Engineering (PhD)', 68),
(103, 'Doctor of Philosophy in Electrical Engineering (PhD)', 68),
(104, 'Doctor of Philosophy in Information Technology (PhD)', 68),
(105, 'Bachelor of Medicine, Bachelor of Surgery (MBBS)', 69),
(106, 'PhD in Artificial Intelligence', 70),
(107, 'PhD in Data Science', 70),
(108, 'PhD in Business Administration', 70),
(109, 'Master of Business Administration (MBA)', 71),
(110, 'Master of Science in Computer Science (MSc)', 71),
(111, 'Master of Science in Electrical Engineering (MSc)', 71),
(112, 'Master of Arts in Sociology (MA)', 71),
(113, 'Diploma in Civil Engineering', 78),
(114, 'Diploma in Mechanical Engineering', 78),
(115, 'Diploma in Electrical Engineering', 78),
(116, 'Diploma in Electronics Engineering', 78),
(117, 'Diploma in Computer Engineering', 78),
(118, 'Diploma in Information Technology', 78),
(119, 'Diploma in Automobile Engineering', 78),
(120, 'Diploma in Chemical Engineering', 78),
(121, 'Diploma in Textile Technology', 78),
(122, 'Diploma in Plastic Engineering', 78),
(123, 'Diploma in Instrumentation Engineering', 78),
(124, 'Diploma in Mining Engineering', 78),
(125, 'Diploma in Metallurgical Engineering', 78),
(126, 'Diploma in Agricultural Engineering', 78),
(127, 'Marketing', 72),
(128, 'Finance', 72),
(129, 'Human Resource Management', 72),
(130, 'International Business', 72),
(131, 'Physics', 73),
(132, 'Chemistry', 73),
(133, 'Mathematics', 73),
(134, 'Computer Science', 73),
(135, 'Marketing', 74),
(136, 'Finance', 74),
(137, 'Human Resources', 74),
(138, 'Operations Management', 74),
(139, 'Data Science', 75),
(140, 'Biotechnology', 75),
(141, 'Environmental Science', 75),
(142, 'Statistics', 75),
(143, 'English Literature', 76),
(144, 'Economics', 76),
(145, 'Political Science', 76),
(146, 'History', 76);

-- --------------------------------------------------------

--
-- Table structure for table `course_types`
--

CREATE TABLE `course_types` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_types`
--

INSERT INTO `course_types` (`id`, `name`) VALUES
(3, 'Diploma'),
(2, 'Postgraduate'),
(1, 'Undergraduate');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `photograph` varchar(255) DEFAULT NULL,
  `parent_affidavit` varchar(255) DEFAULT NULL,
  `proof_of_residence` varchar(255) DEFAULT NULL,
  `receipt_of_paid_fees` varchar(255) DEFAULT NULL,
  `itinerary_ticket` varchar(255) DEFAULT NULL,
  `bank_statement` varchar(255) DEFAULT NULL,
  `bank_statement_owner_id` varchar(255) DEFAULT NULL,
  `passport_copy` varchar(255) DEFAULT NULL,
  `educational_certificates` varchar(255) DEFAULT NULL,
  `id_copy` varchar(255) DEFAULT NULL,
  `offer_letter` varchar(255) DEFAULT NULL,
  `offer_letter_school` varchar(255) DEFAULT NULL,
  `admission_letter` varchar(255) DEFAULT NULL,
  `bonafide_certificate` varchar(255) DEFAULT NULL,
  `student_undertaking_form` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `user_id`, `photograph`, `parent_affidavit`, `proof_of_residence`, `receipt_of_paid_fees`, `itinerary_ticket`, `bank_statement`, `bank_statement_owner_id`, `passport_copy`, `educational_certificates`, `id_copy`, `offer_letter`, `offer_letter_school`, `admission_letter`, `bonafide_certificate`, `student_undertaking_form`, `created_at`, `updated_at`) VALUES
(3, 96, '/check-list-documents/1745302198916-photograph-Buy-Fake-Diploma-from-India-min.webp', '/check-list-documents/1745302160117-parent_affidavit-bachelor.pdf', '/check-list-documents/1745302160128-proof_of_residence-bachelor.pdf', '/check-list-documents/1745302160161-receipt_of_paid_fees-bachelor.pdf', '/check-list-documents/1745302160171-itinerary_ticket-bachelor.pdf', '/check-list-documents/1745302160173-bank_statement-bachelor.pdf', '/check-list-documents/1745302160174-bank_statement_owner_id-bachelor.pdf', '/check-list-documents/1745302160505-passport_copy-bachelor.pdf', '/check-list-documents/1745302160508-educational_certificates-bachelor.pdf', '/check-list-documents/1745302160509-id_copy-bachelor.pdf', '/check-list-documents/1745302160075-offer_letter-bachelor.pdf', '/check-list-documents/1745302160100-offer_letter_school-bachelor.pdf', '/check-list-documents/1745302160080-admission_letter-bachelor.pdf', '/check-list-documents/1745302160085-bonafide_certificate-bachelor.pdf', '/check-list-documents/1745302160088-student_undertaking_form-bachelor.pdf', '2025-04-22 06:09:20', '2025-04-22 06:09:58'),
(4, 105, '/check-list-documents/1746600251962-photograph-Screenshot 2025-05-07 103201.png', '/check-list-documents/1746600251965-parent_affidavit-12th.pdf.pdf', '/check-list-documents/1746600251967-proof_of_residence-12th.pdf.pdf', '/check-list-documents/1746600251969-receipt_of_paid_fees-12th.pdf.pdf', '/check-list-documents/1746600251971-itinerary_ticket-12th.pdf.pdf', '/check-list-documents/1746600251983-bank_statement-12th.pdf.pdf', '/check-list-documents/1746600251986-bank_statement_owner_id-12th.pdf.pdf', '/check-list-documents/1746600251989-passport_copy-12th.pdf.pdf', '/check-list-documents/1746600251993-educational_certificates-12th.pdf.pdf', '/check-list-documents/1746600251996-id_copy-12th.pdf.pdf', '/check-list-documents/1746600251931-offer_letter-12th.pdf.pdf', '/check-list-documents/1746600251959-offer_letter_school-12th.pdf.pdf', '/check-list-documents/1746600251937-admission_letter-12th.pdf.pdf', '/check-list-documents/1746600251952-bonafide_certificate-12th.pdf.pdf', '/check-list-documents/1746600251954-student_undertaking_form-12th.pdf.pdf', '2025-05-07 06:44:12', '2025-05-07 06:44:12');

-- --------------------------------------------------------

--
-- Table structure for table `embassy`
--

CREATE TABLE `embassy` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `embassy_email` varchar(1000) DEFAULT NULL,
  `result_document` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `embassy`
--

INSERT INTO `embassy` (`id`, `user_id`, `embassy_email`, `result_document`, `created_at`) VALUES
(4, 97, 'embassy@gmail.com', '/embassy/embassy-result/1745477500988-result_document-Buy-Fake-Diploma-from-India-min.webp', '2025-04-24 06:50:53'),
(5, 96, '', NULL, '2025-04-24 09:23:51'),
(6, 98, 'ankita31.mcl@gmail.com', NULL, '2025-04-25 13:51:42'),
(7, 99, '', NULL, '2025-04-28 06:58:53'),
(8, 102, '', NULL, '2025-04-30 14:17:29'),
(9, 120, '', '/embassy/embassy-result/1747651769535-result_document-bachelor.pdf', '2025-05-17 14:08:20');

-- --------------------------------------------------------

--
-- Table structure for table `programs`
--

CREATE TABLE `programs` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `course_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `programs`
--

INSERT INTO `programs` (`id`, `name`, `course_id`) VALUES
(66, 'Bachelor of Technology (BTech)', 1),
(67, 'Bachelor of Engineering (BEng)', 1),
(68, 'Master of Technology (MTech)', 2),
(69, 'Master of Engineering (MEng)', 2),
(70, 'Doctor of Philosophy (PhD)', 2),
(71, 'Bachelor of Medicine, Bachelor of Surgery (MBBS)', 1),
(72, 'Bachelor of Business Administration (BBA)', 1),
(73, 'Bachelor of Science (BSc)', 1),
(74, 'Master of Business Administration (MBA)', 2),
(75, 'Master of Science (MSc)', 2),
(76, 'Master of Arts (MA)', 2),
(78, 'Diploma', 3),
(79, 'Poltacnical', 1);

-- --------------------------------------------------------

--
-- Table structure for table `reminder`
--

CREATE TABLE `reminder` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `appointment_date` datetime NOT NULL,
  `appointment_time` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '12 : 00',
  `date_document` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reminder`
--

INSERT INTO `reminder` (`id`, `user_id`, `appointment_date`, `appointment_time`, `date_document`, `created_at`) VALUES
(14, 99, '2025-04-30 00:00:00', '22:43', '/embassy/1746022220301-date_document-bachelor.pdf', '2025-04-28 06:58:53'),
(15, 102, '2025-04-30 00:00:00', '22:50', '/embassy/1746022649765-date_document-bachelor.pdf', '2025-04-30 14:17:29'),
(16, 120, '2025-05-21 00:00:00', '13:29', '/embassy/1747633368205-date_document-1oth-dmc.webp', '2025-05-17 14:08:20');

-- --------------------------------------------------------

--
-- Table structure for table `tenth_marks`
--

CREATE TABLE `tenth_marks` (
  `id` varchar(1000) DEFAULT NULL,
  `subject` varchar(500) DEFAULT NULL,
  `marks` varchar(500) DEFAULT NULL,
  `grade` varchar(500) DEFAULT NULL,
  `percentage` varchar(255) DEFAULT NULL,
  `marks_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tenth_marks`
--

INSERT INTO `tenth_marks` (`id`, `subject`, `marks`, `grade`, `percentage`, `marks_id`) VALUES
('8e23673b-217d-4495-a0d0-7e9b6f041a7a', 'Math', '67', 'C', '12', 5),
('8e23673b-217d-4495-a0d0-7e9b6f041a7a', 'Science', '32', 'C', '12', 6),
('5eece0eb-48da-4571-8ab8-778082241c90', 'qqq', '7', 'qwqw', '1212', 7),
('076110fc-eb11-484b-863e-89e29105c40d', 'Math', '123', 'A', '23', 8),
('076110fc-eb11-484b-863e-89e29105c40d', 'Scince', '123', 'A', '23', 9),
('391a4147-0d3f-40b3-8dc2-33c345983851', 'maths ', '31', 'a', '12', 10),
('21240593-6a04-4d9f-95ae-533704b4dba1', 'hindi', '12', 'a', '1212', 11),
('56f0cc76-4d07-44d2-ad94-036104677cc5', 'Math', '73', 'A', '89', 12),
('56f0cc76-4d07-44d2-ad94-036104677cc5', 'Science', '67', 'A', '89', 13),
('56f0cc76-4d07-44d2-ad94-036104677cc5', 'English', '55', 'A', '89', 14),
('56f0cc76-4d07-44d2-ad94-036104677cc5', 'Hindi', '66', 'A', '89', 15),
('56f0cc76-4d07-44d2-ad94-036104677cc5', 'SST', '78', 'A', '89', 16);

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `departure_datetime` datetime NOT NULL,
  `destination_datetime` datetime NOT NULL,
  `departure_port` varchar(100) NOT NULL,
  `destination_port` varchar(100) NOT NULL,
  `ticket_document` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `user_id`, `departure_datetime`, `destination_datetime`, `departure_port`, `destination_port`, `ticket_document`, `created_at`) VALUES
(1, 95, '2025-04-20 18:11:00', '2025-04-21 19:13:00', 'JFK Airport', 'HealthRow', '/airport-images/1745055581923-ticket_document-bachelor.pdf', '2025-04-19 09:39:41'),
(2, 96, '2025-04-25 14:22:00', '2025-04-28 15:23:00', 'JFG', 'Hallow', '/airport-images/1745300986521-ticket_document-1oth-dmc.webp', '2025-04-22 05:49:46'),
(3, 117, '2025-05-18 13:03:00', '2025-05-18 13:06:00', 'Delhi', 'Chandigarh', '/uploads/1747466215598-3oidgmb-bachelor.pdf', '2025-05-17 07:16:55'),
(4, 110, '2025-05-17 17:59:00', '2025-05-17 17:59:00', 'fdregergr', 'sfhttrthr', '/uploads/1747484091381-hi9aeyj-profile_img.jpg', '2025-05-17 12:14:51'),
(5, 119, '2025-05-17 18:05:00', '2025-05-17 18:05:00', 'sdfaag', 'agdadfgd', '/uploads/1747484425005-wdi9kra-profile_img.jpg', '2025-05-17 12:20:25');

-- --------------------------------------------------------

--
-- Table structure for table `twefth_marks`
--

CREATE TABLE `twefth_marks` (
  `id` varchar(500) DEFAULT NULL,
  `subject` varchar(500) DEFAULT NULL,
  `marks` varchar(500) DEFAULT NULL,
  `grade` varchar(500) DEFAULT NULL,
  `percentage` varchar(255) DEFAULT NULL,
  `marks_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `twefth_marks`
--

INSERT INTO `twefth_marks` (`id`, `subject`, `marks`, `grade`, `percentage`, `marks_id`) VALUES
('2e7d7c80-ae15-4cae-8cbe-07c683434b02', 'maths', '45', 'f', '-90', 1),
('2e7d7c80-ae15-4cae-8cbe-07c683434b02', 'aaqqa', '545', 'f', '-90', 2),
('482b884e-ae3d-4c67-ba6a-c1c106e3320f', 'Math', '123', '', '', 3),
('482b884e-ae3d-4c67-ba6a-c1c106e3320f', 'wff', '22', '', '', 4),
('267ed1bd-97c0-4f78-987a-844cb994fe23', '11', '12', '', '12', 5),
('3110825b-8561-4171-8b46-214a47d68730', 'English', '78', '', '93', 6),
('3110825b-8561-4171-8b46-214a47d68730', 'Math', '85', '', '93', 7),
('3110825b-8561-4171-8b46-214a47d68730', 'Physics', '78', '', '93', 8),
('3110825b-8561-4171-8b46-214a47d68730', 'Chemistry', '56', '', '93', 9),
('3110825b-8561-4171-8b46-214a47d68730', 'Hindi', '55', '', '93', 10);

-- --------------------------------------------------------

--
-- Table structure for table `universities`
--

CREATE TABLE `universities` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `program_id` int NOT NULL,
  `university_country_id` int DEFAULT NULL,
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `campus` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `university_email` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fees` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `annual_fees` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `entry_type` int NOT NULL DEFAULT '1',
  `email_status` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `universities`
--

INSERT INTO `universities` (`id`, `name`, `program_id`, `university_country_id`, `location`, `campus`, `university_email`, `fees`, `annual_fees`, `description`, `entry_type`, `email_status`) VALUES
(37, 'University of Tech Innovation', 66, 386, 'San Francisco, USA', 'Innovation Campus', NULL, '550001', '320000', 'A leading university focusing on cutting-edge technology programs and research in AI and Robotics.', 1, 0),
(38, 'Tech Masters University', 66, 386, 'Austin, USA', 'Downtown Campus', NULL, '53000', '31000', 'Specializes in advanced technology courses and research.', 1, 0),
(40, 'Innovative University', 66, 265, 'Berlin, Germany', 'East Campus', NULL, '54000', '32500', 'A hub for tech innovation and research in computer science and AI.', 1, 0),
(41, 'Tech Frontier University', 66, 285, 'Tokyo, Japan', 'Main Campus', NULL, '58000', '34000', 'A leader in robotics, artificial intelligence, and engineering education.', 1, 0),
(42, 'FutureTech University', 66, 261, 'Paris, France', 'Central Campus', NULL, '50000', '30000', 'A future-focused university offering tech programs and research opportunities.', 1, 0),
(43, 'International Tech School', 66, 386, 'New York, USA', 'Downtown Campus', NULL, '52000', '31500', 'Provides specialized programs in software engineering and IT infrastructure.', 1, 0),
(44, 'NextGen University', 66, 356, 'Singapore', 'Innovation Hub', NULL, '60000', '35000', 'Focuses on next-generation technologies and cutting-edge research in AI and robotics.', 1, 0),
(45, 'Advanced Studies University', 67, 265, 'Berlin, Germany', 'North Campus', NULL, '48000', '28000', 'Known for its advanced research in artificial intelligence, machine learning, and data science.', 1, 0),
(46, 'Future Leaders University', 67, 386, 'Boston, USA', 'West Campus', NULL, '47000', '27500', 'Offers an interdisciplinary approach to AI, data science, and business.', 1, 0),
(47, 'International Institute of Technology', 67, 385, 'London, UK', 'Tech Campus', NULL, '49000', '29000', 'Leading in AI and machine learning education, offering hands-on experience.', 1, 0),
(48, 'AI Research University', 67, 386, 'San Francisco, USA', 'Silicon Valley Campus', NULL, '52000', '31000', 'Focused on artificial intelligence and data-driven research.', 1, 0),
(49, 'Innovative Learning University', 67, 210, 'Sydney, Australia', 'Central Campus', NULL, '51000', '30500', 'Prepares students for careers in AI, machine learning, and computer vision.', 1, 0),
(50, 'Global University of Technology', 67, 233, 'Toronto, Canada', 'Downtown Campus', NULL, '53000', '32000', 'Leads in innovative research and teaching in AI and robotics.', 1, 0),
(51, 'Tech Research University', 67, 369, 'Zurich, Switzerland', 'Global Campus', NULL, '54000', '32500', 'Research-driven programs in AI, deep learning, and data science.', 1, 0),
(52, 'Science and AI University', 67, 261, 'Paris, France', 'Research Campus', NULL, '50000', '30000', 'Specializes in AI research, providing students with cutting-edge knowledge and skills.', 1, 0),
(53, 'Global Research Institute', 68, 233, 'Toronto, Canada', 'Main Campus', NULL, '51000', '29000', 'An institution focused on interdisciplinary research and advanced studies in science and engineering.', 1, 0),
(54, 'Innovative Science University', 68, 386, 'Los Angeles, USA', 'Central Campus', NULL, '53000', '30000', 'Known for advanced research in environmental science and engineering.', 1, 0),
(55, 'Tech and Science University', 68, 261, 'Paris, France', 'Science Campus', NULL, '55000', '31000', 'Offering programs in interdisciplinary science and technology research.', 1, 0),
(56, 'International Research University', 68, 356, 'Singapore', 'East Campus', NULL, '52000', '30000', 'Leads in interdisciplinary research in technology and sciences.', 1, 0),
(57, 'Future Innovations University', 68, 265, 'Berlin, Germany', 'West Campus', NULL, '54000', '32500', 'Offers innovative programs in environmental science and sustainable technology.', 1, 0),
(58, 'Tech and Research Academy', 68, 369, 'Zurich, Switzerland', 'Global Campus', NULL, '56000', '33000', 'Provides cutting-edge education and research in science and technology fields.', 1, 0),
(59, 'Interdisciplinary Research University', 68, 386, 'New York, USA', 'Innovation Campus', NULL, '58000', '34000', 'Focuses on cross-disciplinary research to solve global challenges in technology and science.', 1, 0),
(60, 'Global Science Institute', 68, 385, 'London, UK', 'Tech Research Campus', NULL, '57000', '33500', 'Leads scientific advancements through research in various fields of study.', 1, 0),
(61, 'International University of Sciences', 69, 210, 'Sydney, Australia', 'East Campus', NULL, '47000', '26000', 'Offers a wide range of programs in medical and environmental sciences, with a focus on global sustainability.', 1, 0),
(62, 'Sustainability and Science University', 69, 233, 'Vancouver, Canada', 'Main Campus', NULL, '48000', '26500', 'Focuses on sustainable development and environmental science.', 1, 0),
(63, 'Global Environmental University', 69, 265, 'Berlin, Germany', 'North Campus', NULL, '49000', '27000', 'Leads in research on climate change and global sustainability.', 1, 0),
(64, 'Future Science Academy', 69, 386, 'Los Angeles, USA', 'South Campus', NULL, '50000', '27500', 'Prepares students for careers in environmental and earth sciences.', 1, 0),
(65, 'GreenTech University', 69, 385, 'London, UK', 'Central Campus', NULL, '51000', '28000', 'Provides education in green technologies and environmental management.', 1, 0),
(66, 'Sustainable Innovation University', 69, 233, 'Toronto, Canada', 'West Campus', NULL, '53000', '29000', 'Offers programs aimed at creating innovative solutions for environmental challenges.', 1, 0),
(67, 'Environmental Solutions University', 69, 386, 'New York, USA', 'Innovation Campus', NULL, '55000', '30000', 'A leading university in the field of environmental science and sustainable practices.', 1, 0),
(68, 'Sustainability Research Institute', 69, 261, 'Paris, France', 'Research Campus', NULL, '54000', '29500', 'A center for research in sustainability and green technologies.', 1, 0),
(69, 'Innovation and Research Institute', 70, 285, 'Tokyo, Japan', 'Innovation Campus', NULL, '53000', '28500', 'A prestigious institute known for its research and innovation in emerging technologies.', 1, 0),
(71, 'Advanced Technologies University', 70, 265, 'Berlin, Germany', 'Central Campus', NULL, '56000', '31000', 'Focuses on research in advanced technology, engineering, and applied sciences.', 1, 0),
(72, 'Tech Innovation Academy', 70, 386, 'San Francisco, USA', 'Innovation Campus', NULL, '59000', '32000', 'Offers specialized programs in the innovation and research of next-gen technologies.', 1, 0),
(73, 'Global Engineering Institute', 70, 385, 'London, UK', 'Tech Campus', NULL, '58000', '31500', 'Known for its excellence in engineering and applied technology research.', 1, 0),
(74, 'Tech and Research Institute', 70, 261, 'Paris, France', 'Research Campus', NULL, '55000', '30500', 'Leads in technological research and development, with a focus on sustainable solutions.', 1, 0),
(75, 'FutureTech Academy', 70, 233, 'Toronto, Canada', 'Innovation Hub', NULL, '57000', '31000', 'Specializes in future technologies, focusing on AI, robotics, and advanced engineering.', 1, 0),
(76, 'International Research University', 70, 210, 'Sydney, Australia', 'Central Campus', NULL, '60000', '33000', 'Provides a platform for cutting-edge research in technology and science.', 1, 0),
(77, 'Next Generation Research Institute', 71, 386, 'New York, USA', 'Tech Campus', NULL, '56000', '33000', 'Focuses on next-generation technology research and innovations in AI.', 1, 0),
(78, 'Global Institute of Technology', 71, 261, 'Paris, France', 'Innovation Campus', NULL, '57000', '33500', 'A leading institution in technological innovation and research in applied sciences.', 1, 0),
(79, 'Tech Research and Innovation University', 71, 385, 'London, UK', 'Main Campus', NULL, '59000', '34000', 'Provides a strong focus on research and development of new technologies.', 1, 0),
(80, 'Future Tech Academy', 71, 285, 'Tokyo, Japan', 'Central Campus', NULL, '60000', '35000', 'A hub for next-gen technology and engineering education, fostering innovation.', 1, 0),
(81, 'International Science and Tech University', 71, 265, 'Berlin, Germany', 'Tech Campus', NULL, '61000', '35500', 'Known for cutting-edge research and education in computer science, engineering, and technology.', 1, 0),
(82, 'Global Technology Innovation University', 71, 356, 'Singapore', 'Innovation Hub', NULL, '62000', '36000', 'Leading the world in technological research, with a focus on AI and robotics.', 1, 0),
(83, 'Innovation Leaders Academy', 71, 386, 'San Francisco, USA', 'Innovation Campus', NULL, '63000', '37000', 'Offers transformative education in technology, innovation, and entrepreneurship.', 1, 0),
(84, 'Tech Excellence Institute', 71, 233, 'Toronto, Canada', 'Research Campus', NULL, '64000', '38000', 'A research-driven university with a focus on breakthrough technologies.', 1, 0),
(85, 'Global Research and Tech Academy', 72, 369, 'Zurich, Switzerland', 'Innovation Campus', NULL, '65000', '38500', 'A world leader in research in technology, computer science, and data science.', 1, 0),
(86, 'Tech Innovators University', 72, 386, 'Los Angeles, USA', 'Main Campus', NULL, '66000', '39000', 'Focuses on technology innovations and breakthrough research in artificial intelligence.', 1, 0),
(87, 'Research and Technology Institute', 72, 265, 'Berlin, Germany', 'Innovation Campus', NULL, '67000', '39500', 'Offers cutting-edge education in technology with a research-driven approach.', 1, 0),
(88, 'Tech and Science University', 72, 385, 'London, UK', 'Research Campus', NULL, '68000', '40000', 'Prepares students for high-impact careers in tech and applied sciences.', 1, 0),
(89, 'Advanced Technologies Institute', 72, 233, 'Toronto, Canada', 'Main Campus', NULL, '69000', '40500', 'An institute dedicated to advancing research and education in emerging technologies.', 1, 0),
(90, 'Global Science and Technology Academy', 72, 386, 'San Francisco, USA', 'Innovation Campus', NULL, '70000', '41000', 'Leads in technological research with a focus on AI, robotics, and machine learning.', 1, 0),
(91, 'Innovation Research University', 72, 261, 'Paris, France', 'Tech Research Campus', NULL, '71000', '41500', 'Offers advanced programs in technology research and AI innovations.', 1, 0),
(92, 'Cutting Edge Tech University', 72, 356, 'Singapore', 'Innovation Campus', NULL, '72000', '42000', 'A premier university for cutting-edge research and development in technology.', 1, 0),
(93, 'University of Tech Innovation', 78, 386, 'San Francisco USA', 'Innovation Campus', NULL, '55000', '55000', 'A leading university focusing on cutting-edge tech...', 1, 0),
(94, 'Tech Masters University', 78, 386, 'Austin USA', 'Downtown Campus', NULL, '53000', '53000', 'Specializes in advanced technology courses and research...', 1, 0),
(95, 'Global Tech Academy', 78, 385, 'London UK', 'Central Campus', NULL, '56000', '56000', 'Provides global exposure in tech industries with practical learning...', 1, 0),
(96, 'Innovative University', 78, 265, 'Berlin Germany', 'East Campus', NULL, '54000', '54000', 'A hub for tech innovation and research in computer science...', 1, 0),
(97, 'Tech Frontier University', 78, 285, 'Tokyo Japan', 'Main Campus', NULL, '58000', '58000', 'A leader in robotics, artificial intelligence, and innovation...', 1, 0),
(98, 'Global Business School', 73, 386, 'New York, USA', 'Downtown Campus', NULL, '45000', '15000', 'A top-tier BBA institution focused on global business strategies.', 1, 0),
(99, 'International School of Management', 73, 385, 'London, UK', 'Central Campus', NULL, '47000', '15500', 'Offers diverse BBA specializations with global exposure.', 1, 0),
(100, 'Metropolitan Business University', 73, 233, 'Toronto, Canada', 'Metro Campus', NULL, '44000', '14800', 'Renowned for modern business curriculum and industry tie-ups.', 1, 0),
(101, 'Elite Business Institute', 73, 356, 'Singapore', 'Innovation Campus', NULL, '46000', '15200', 'Famous for experiential BBA learning and internships.', 1, 0),
(102, 'City Business Academy', 73, 384, 'Dubai, UAE', 'Financial District Campus', NULL, '43000', '14500', 'Focused on finance, marketing, and entrepreneurship studies.', 1, 0),
(103, 'Science and Tech College', 74, 386, 'Boston, USA', 'Science Campus', NULL, '42000', '14000', 'Offers leading-edge education in core sciences.', 1, 0),
(104, 'Modern Science University', 74, 265, 'Berlin, Germany', 'North Campus', NULL, '44000', '14500', 'Research-focused institution in physical sciences.', 1, 0),
(105, 'Innovative Science Institute', 74, 210, 'Sydney, Australia', 'Central Campus', NULL, '43000', '14300', 'Provides quality education in physics, chemistry, and biology.', 1, 0),
(106, 'Future Science College', 74, 261, 'Paris, France', 'West Campus', NULL, '41000', '13700', 'Known for interdisciplinary science programs.', 1, 0),
(107, 'Advanced BSc Academy', 74, 285, 'Tokyo, Japan', 'East Campus', NULL, '45000', '15000', 'Offers modern labs and practical learning in sciences.', 1, 0),
(108, 'Global Management University', 75, 386, 'San Francisco, USA', 'Silicon Valley Campus', NULL, '60000', '20000', 'Premier MBA school with strong alumni network.', 1, 0),
(109, 'TechBiz School of Management', 75, 265, 'Berlin, Germany', 'Tech Campus', NULL, '58000', '19500', 'Blends tech innovation with MBA leadership skills.', 1, 0),
(110, 'Leadership & Strategy Institute', 75, 356, 'Singapore', 'Business Campus', NULL, '57000', '19000', 'Specializes in leadership, operations, and strategic thinking.', 1, 0),
(111, 'Executive MBA Academy', 75, 385, 'London, UK', 'City Campus', NULL, '59000', '19800', 'Known for executive training and corporate tie-ins.', 1, 0),
(112, 'Metro Global Business School', 75, 233, 'Toronto, Canada', 'Downtown Campus', NULL, '61000', '20200', 'Focused on entrepreneurship, finance, and marketing.', 1, 0),
(113, 'Institute of Advanced Science', 76, 369, 'Zurich, Switzerland', 'Global Campus', NULL, '55000', '18500', 'Advanced MSc programs in data science and AI.', 1, 0),
(114, 'NextGen Science University', 76, 385, 'London, UK', 'Research Campus', NULL, '53000', '17800', 'Emphasizes innovation and scientific research.', 1, 0),
(115, 'Innovative Tech and Science Academy', 76, 386, 'Austin, USA', 'Innovation Campus', NULL, '56000', '18700', 'Equipped for advanced studies in environmental and life sciences.', 1, 0),
(116, 'Future Research Institute', 76, 261, 'Paris, France', 'Science Hub', NULL, '54000', '18200', 'Provides an international MSc experience in multiple science fields.', 1, 0),
(117, 'International Science School', 76, 265, 'Berlin, Germany', 'East Campus', NULL, '52000', '17500', 'Global leader in research-oriented MSc programs.', 1, 0),
(118, 'IIT Delhi', 76, 277, 'Delhi, India', 'North Campus', 'sharmanitin.mcl@gmail.com', '52000', '17500', 'Global leader in research-oriented MSc programs.', 1, 0),
(119, 'Chandigarh University', 76, 277, 'Chandigarh , India', 'North Campus', 'sharmanitin.mcl@gmail.com', '52000', '17500', 'Global leader in research-oriented MSc programs.', 1, 0),
(120, 'Chitkara University', 76, 277, 'Kharar, India', 'North Campus', 'sharmanitin.mcl@gmail.com', '52000', '17500', 'Global leader in research-oriented MSc programs.', 0, 0),
(121, 'Punjab University', 73, 277, 'Punjab , India', 'North Campus', 'sharmanitin.mcl@gmail.com', '52000', '17500', 'Global leader in research-oriented MSc programs.', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `uni_payments`
--

CREATE TABLE `uni_payments` (
  `user_id` int DEFAULT NULL,
  `payment_document` varchar(1000) DEFAULT NULL,
  `payment_status` int DEFAULT '0',
  `id` int NOT NULL,
  `payment_type` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `uni_payments`
--

INSERT INTO `uni_payments` (`user_id`, `payment_document`, `payment_status`, `id`, `payment_type`) VALUES
(120, '/documents/payments/receipt_120_1747641733702.pdf', 1, 3, 'yearly');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `profile_img` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `agent_id` int DEFAULT NULL,
  `country_id` int NOT NULL,
  `university_country` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_proof` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `otp` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  `program_id` int DEFAULT NULL,
  `university_id` int DEFAULT NULL,
  `tenth_certificate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tenth_marks_id` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `twelfth_certificate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `twelfth_marks_id` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bachelor_marks_id` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bachelor_certificate` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `other_certificate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `course_trade_id` int DEFAULT NULL,
  `course_type_id` int DEFAULT NULL,
  `offer_letter` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `admission_letter` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bonafide_letter` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `visa` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_receipt` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ugc_letter` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `affiliation_letter` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_status` int DEFAULT '0',
  `offer_letter_status` int DEFAULT '0',
  `document_verified_status` int NOT NULL DEFAULT '0',
  `application_submitted` int NOT NULL DEFAULT '0',
  `is_eligible` int NOT NULL DEFAULT '0',
  `uni_email_status` int NOT NULL DEFAULT '0',
  `request_doc` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `profile_img`, `email`, `password`, `phone_number`, `agent_id`, `country_id`, `university_country`, `id_proof`, `otp`, `otp_expires_at`, `is_verified`, `created_at`, `updated_at`, `is_deleted`, `program_id`, `university_id`, `tenth_certificate`, `tenth_marks_id`, `twelfth_certificate`, `twelfth_marks_id`, `bachelor_marks_id`, `bachelor_certificate`, `other_certificate`, `course_trade_id`, `course_type_id`, `offer_letter`, `admission_letter`, `bonafide_letter`, `visa`, `payment_receipt`, `ugc_letter`, `affiliation_letter`, `payment_status`, `offer_letter_status`, `document_verified_status`, `application_submitted`, `is_eligible`, `uni_email_status`, `request_doc`) VALUES
(99, 'Ankita shukla', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', 'ankita311.mcl@gmail.com', '$2b$10$riXsClB7Pa78q8nYsWrnd.KnJ5Z4ZYMLUQ0hKYVbPWuL9TX2fSuTG', '9015076296', 1, 277, '210', '/uploads/1745821623372-jbfa24p-bachelor.pdf', '6149', '2025-04-28 12:07:04', 1, '2025-04-28 06:27:03', '2025-05-19 10:27:50', 0, 67, 120, '/uploads/1745821623358-4ja4c1l-10th_dmc.pdf', NULL, '/uploads/1745821623362-3iu9mgv-12th_non_medial.pdf', NULL, NULL, NULL, '/uploads/1745821623374-qvt540s-bachelor.pdf', 88, 1, '/offerletters/99_Offer_Letter.pdf', '/documents/99_Admission_Letter.pdf', '/documents/99_Bonafide_Letter.pdf', '/documents/99_Visa.pdf', '/documents/1747650470393-jhonljp-10th_dmc.pdf', '/documents/99_ugc_letter.pdf', '/documents/99_affiliation_letter.pdf', 1, 1, 0, 1, 0, 0, 0),
(100, 'jatin', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', 'test@gmail.com', '$2b$10$oFs8AV0xC83zyzUlt2zpBON2.AV1PeiEdBoorMxc2B2zkKWFQJ2RS', '9803900611', 1, 277, '210', '/uploads/1745826170591-upga6ov-FILE....pdf', '9391', '2025-04-28 13:22:51', 1, '2025-04-28 07:42:50', '2025-05-20 06:09:23', 0, 71, 51, '/uploads/1745826170448-zvupn36-10th_dmc.pdf', NULL, '/uploads/1745826170522-pt5wmtr-12th_non_medial.pdf', NULL, NULL, NULL, '/uploads/1745826170717-mdje9o3-bachelor.pdf', 88, 1, '/offerletters/100_Offer_Letter.pdf', '/documents/100_Admission_Letter.pdf', '/documents/100_Bonafide_Letter.pdf', '/documents/100_Visa.pdf', '/documents/100_Payment_Receipt.pdf', '/documents/100_ugc_letter.pdf', '/documents/100_affiliation_letter.pdf', 0, 1, 1, 1, 1, 0, 0),
(102, 'Nithin Sharma', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', 'sharmanitin1.mcl@gmail.com', '$2b$10$qtPmCM1WNgIHpfIW2qAY.ulouNQ.h3y8aNRmD7yMvvKhQI7.DuSzy', '9015076296', 1, 277, '210', '/uploads/1746022407607-kf39xel-bachelor.pdf', '7658', '2025-04-30 19:53:28', 1, '2025-04-30 14:13:27', '2025-05-12 09:08:59', 0, 66, 61, '/uploads/1746022407347-q0omqly-10th_dmc.pdf', NULL, '/uploads/1746022407454-7sampoh-12th_non_medial.pdf', NULL, NULL, NULL, '/uploads/1746022407683-brqf6c3-bachelor.pdf', 88, 1, '/offerletters/102_Offer_Letter.pdf', '/documents/102_Admission_Letter.pdf', '/documents/102_Bonafide_Letter.pdf', '/documents/102_Visa.pdf', '/documents/102_Payment_Receipt.pdf', '/documents/102_ugc_letter.pdf', '/documents/102_affiliation_letter.pdf', 1, 1, 1, 1, 1, 0, 0),
(105, 'Student', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', 'nitin@gmail.com', '$2b$10$cVzsotdDtZn0dSmQHW3d4uoxCByibFM/8X6/jfrn6ueYJAWNDh1wS', '9015076296', NULL, 277, '277', '/uploads/1746170531354-swwtdmt-bachelor.pdf', '1161', '2025-05-02 13:02:12', 1, '2025-05-02 07:22:11', '2025-05-12 07:45:06', 0, 66, 118, '/uploads/1746176822314-3j5ur64-10th_dmc.pdf', NULL, '/uploads/1746176822400-dcj7zo4-12th.pdf.pdf', NULL, NULL, NULL, '/uploads/1746170531359-g1o2620-bachelor.pdf', 89, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 1, 1, 0, 0),
(109, 'Gulshan', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', 'gulshan@gmail.com', '$2b$10$eShAVWaQEujkIKcHYiPq7OtvlFVl6Nz9Y0uIvVVGATqRsWUeDr5YK', '9015076296', 2, 277, '277', '/uploads/1746178433969-zdy8p2p-bachelor.pdf', '8908', '2025-05-02 15:13:54', 0, '2025-05-02 09:33:54', '2025-05-12 07:44:32', 0, 71, 119, '/uploads/1746178433922-lk8vbs2-10th_dmc.pdf', NULL, '/uploads/1746178433954-rj79k3s-12th.pdf.pdf', NULL, NULL, NULL, '/uploads/1746178433980-a7kns4r-12th.pdf.pdf', 110, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 1, 0, 0, 0),
(110, 'Chatur Chopra', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', 'jatinverma3049.mcl@gmail.com', '$2b$10$WofSM5ZqebTdwJRCktZ0NOLZ6WOrDm64sG6WCnuF1BJLi6IQ9tl2.', '2165498703', 2, 277, '277', '/uploads/1746431528586-jjkbz1f-12th_medical.pdf', '8296', '2025-05-05 13:32:09', 1, '2025-05-05 07:52:09', '2025-05-15 12:58:12', 0, 66, 120, '/uploads/1746431528510-alog2e7-10th_dmc.pdf', NULL, '/uploads/1746431528522-0exx7pn-12th_non_medial.pdf', NULL, NULL, NULL, '/uploads/1746431528590-g6g1rup-bachelor.pdf', 88, 1, '/offerletters/110_Offer_Letter.pdf', NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0, 1, 0, 0, 0),
(119, 'Ankita Shulka', '/uploads/1747483525840-qb6s4e8-profile_img.jpg', 'ankita31.mcl@gmail.com', '$2b$10$s06HqeBOlR0elQNxfkJD1ed47bJCM.CP.JsV44n8m8XM8N.m2rckK', '2333333333', 21, 277, '277', '/uploads/1747483525825-1kg31q2-bachelor.pdf', '3944', '2025-05-17 18:00:26', 0, '2025-05-17 12:05:26', '2025-05-17 12:05:26', 0, 66, 119, '/uploads/1747483525779-yyiw5q9-10th_dmc.pdf', '21240593-6a04-4d9f-95ae-533704b4dba1', '/uploads/1747483525799-9fo7cwy-12th_medical.pdf', '267ed1bd-97c0-4f78-987a-844cb994fe23', NULL, NULL, '/uploads/1747483525874-qul9i5y-12th_arts.pdf', 89, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0),
(120, 'Nitin Sharmaa', '/uploads/1747489775575-in7pfow-profile_img.jpg', 'sharmanitin.mcl@gmail.com', '$2b$10$Uh2LR66L4ElckdeZqL7Bgu67KCoO0gMu.O8QDYmhxPd1R9hXIK.O6', '9350101921', 1, 277, '277', '/uploads/1747489775567-jws79g7-bachelor.pdf', '4672', '2025-05-17 19:44:36', 1, '2025-05-17 13:49:35', '2025-05-19 10:38:36', 0, 66, 120, '/uploads/1747489775489-lnk6ozv-10th_dmc.pdf', '56f0cc76-4d07-44d2-ad94-036104677cc5', '/uploads/1747489775539-jud9uwc-12th_arts.pdf', '3110825b-8561-4171-8b46-214a47d68730', NULL, NULL, '/uploads/1747489775604-cdzudyp-10th_dmc.pdf', 88, 1, '/offerletters/1747490155351-g184jmr-bachelor.pdf', '/documents/1747490596576-63xphpw-10th_dmc.pdf', '/documents/1747490749266-dq346is-12th_arts.pdf', '/documents/1747491051701-nkjygkz-12th_arts.pdf', '/documents/1747651115999-tmvwvd2-bachelor.pdf', NULL, NULL, 1, 1, 1, 1, 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `visa`
--

CREATE TABLE `visa` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `visa_document` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `visa_decision_letter` varchar(1000) DEFAULT NULL,
  `photo` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `visa`
--

INSERT INTO `visa` (`id`, `user_id`, `visa_document`, `visa_decision_letter`, `photo`, `created_at`) VALUES
(4, 96, '/embassy/visa-result/1745314618174-visa_document-1oth-dmc.webp', '/embassy/visa-result/1745314463405-visa_decision_letter-bachelor.pdf', NULL, '2025-04-22 09:34:23'),
(5, 96, '/embassy/visa-result/1745314618174-visa_document-1oth-dmc.webp', '/embassy/visa-result/1745314469270-visa_decision_letter-bachelor.pdf', NULL, '2025-04-22 09:34:29'),
(6, 96, NULL, '/embassy/visa-result/1745314639338-visa_decision_letter-12th_arts.pdf', NULL, '2025-04-22 09:37:19'),
(8, 105, '/embassy/visa-result/1746601465669-visa_document-12th.pdf.pdf', '/embassy/visa-result/1746601453934-visa_decision_letter-12th.pdf.pdf', NULL, '2025-05-07 07:04:13'),
(9, 115, '/uploads/1747314535478-mgjhwoq-12th_arts.pdf', NULL, '/uploads/1747314535540-zg4eg7l-1oth-dmc.webp', '2025-05-15 11:41:06'),
(10, 120, '/embassy/visa-result/1747491105035-visa_document-bachelor.pdf', '/embassy/visa-result/1747491090062-visa_decision_letter-bachelor.pdf', NULL, '2025-05-17 14:11:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `airport_pickup`
--
ALTER TABLE `airport_pickup`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bachelor_marks`
--
ALTER TABLE `bachelor_marks`
  ADD UNIQUE KEY `marks_id` (`marks_id`);

--
-- Indexes for table `commission`
--
ALTER TABLE `commission`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `country_code`
--
ALTER TABLE `country_code`
  ADD PRIMARY KEY (`code_id`),
  ADD KEY `fk_country` (`country_id`);

--
-- Indexes for table `course_trades`
--
ALTER TABLE `course_trades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `program_id` (`program_id`);

--
-- Indexes for table `course_types`
--
ALTER TABLE `course_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `embassy`
--
ALTER TABLE `embassy`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `fk_programs_course` (`course_id`);

--
-- Indexes for table `reminder`
--
ALTER TABLE `reminder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tenth_marks`
--
ALTER TABLE `tenth_marks`
  ADD UNIQUE KEY `marks_id` (`marks_id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `twefth_marks`
--
ALTER TABLE `twefth_marks`
  ADD UNIQUE KEY `marks_id` (`marks_id`);

--
-- Indexes for table `universities`
--
ALTER TABLE `universities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `program_id` (`program_id`);

--
-- Indexes for table `uni_payments`
--
ALTER TABLE `uni_payments`
  ADD UNIQUE KEY `marks_id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `country_id` (`country_id`),
  ADD KEY `program_id` (`program_id`),
  ADD KEY `university_id` (`university_id`);

--
-- Indexes for table `visa`
--
ALTER TABLE `visa`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `agents`
--
ALTER TABLE `agents`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `airport_pickup`
--
ALTER TABLE `airport_pickup`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bachelor_marks`
--
ALTER TABLE `bachelor_marks`
  MODIFY `marks_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `commission`
--
ALTER TABLE `commission`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=396;

--
-- AUTO_INCREMENT for table `course_trades`
--
ALTER TABLE `course_trades`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT for table `course_types`
--
ALTER TABLE `course_types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `embassy`
--
ALTER TABLE `embassy`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `programs`
--
ALTER TABLE `programs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `reminder`
--
ALTER TABLE `reminder`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tenth_marks`
--
ALTER TABLE `tenth_marks`
  MODIFY `marks_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `twefth_marks`
--
ALTER TABLE `twefth_marks`
  MODIFY `marks_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `universities`
--
ALTER TABLE `universities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT for table `uni_payments`
--
ALTER TABLE `uni_payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `visa`
--
ALTER TABLE `visa`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `country_code`
--
ALTER TABLE `country_code`
  ADD CONSTRAINT `fk_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`);

--
-- Constraints for table `course_trades`
--
ALTER TABLE `course_trades`
  ADD CONSTRAINT `course_trades_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `programs`
--
ALTER TABLE `programs`
  ADD CONSTRAINT `fk_programs_course` FOREIGN KEY (`course_id`) REFERENCES `course_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reminder`
--
ALTER TABLE `reminder`
  ADD CONSTRAINT `reminder_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `universities`
--
ALTER TABLE `universities`
  ADD CONSTRAINT `universities_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
