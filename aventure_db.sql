-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gazdă: 127.0.0.1
-- Timp de generare: oct. 16, 2026 la 11:29 AM
-- Versiune server: 10.4.32-MariaDB
-- Versiune PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Bază de date: `aventure_db`
--

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sender` enum('user','admin') NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `user_id`, `sender`, `message`, `created_at`) VALUES
(1, 1, 'user', 'wew', '2026-10-16 12:03:04'),
(2, 1, 'admin', 'wewewe', '2026-10-16 12:03:22'),
(3, 1, 'user', 'da', '2026-10-16 12:14:56'),
(4, 1, 'admin', 'da', '2026-10-16 12:15:07'),
(5, 1, 'admin', 'da', '2026-10-16 12:15:33'),
(6, 1, 'user', 'da', '2026-10-16 12:15:39'),
(7, 1, 'admin', 'sss', '2026-10-16 12:15:41'),
(8, 1, 'user', 'dsad', '2026-10-16 12:15:43'),
(9, 1, 'user', 'da', '2026-10-16 12:21:04');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) NOT NULL DEFAULT '',
  `category` varchar(100) NOT NULL,
  `destination` varchar(150) NOT NULL,
  `country` varchar(100) NOT NULL DEFAULT '',
  `duration_days` int(11) NOT NULL DEFAULT 1,
  `duration_nights` int(11) NOT NULL DEFAULT 0,
  `price_ron` int(11) NOT NULL DEFAULT 0,
  `image_url` varchar(500) NOT NULL DEFAULT '',
  `short_desc` text DEFAULT NULL,
  `full_desc` text DEFAULT NULL,
  `difficulty` varchar(50) NOT NULL DEFAULT 'Ușor',
  `transport` varchar(150) NOT NULL DEFAULT '',
  `accommodation` varchar(150) NOT NULL DEFAULT '',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `offer_id` varchar(100) NOT NULL,
  `offer_title` varchar(255) NOT NULL DEFAULT '',
  `message` text DEFAULT NULL,
  `status` enum('noua','in_progres','confirmata','anulata') NOT NULL DEFAULT 'noua',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `reservations`
--

INSERT INTO `reservations` (`id`, `name`, `email`, `phone`, `offer_id`, `offer_title`, `message`, `status`, `created_at`) VALUES
(3, 'Mihai Cosmin', 'mihaioprea382@gmail.com', '0750669450', 'aventura-carpatilor', 'Canionul 7 Scări & Masivul Piatra Mare', 'sdadsaa', 'confirmata', '2026-10-16 11:14:39');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL DEFAULT 5,
  `body` text NOT NULL,
  `offer_id` varchar(100) NOT NULL DEFAULT '',
  `approved` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `rating`, `body`, `offer_id`, `approved`, `created_at`) VALUES
(1, 1, 5, 'o firma foarte buna', '', 1, '2026-10-16 12:28:09');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birthdate` date NOT NULL,
  `phone` varchar(30) NOT NULL DEFAULT '',
  `created_at` datetime DEFAULT current_timestamp(),
  `role` enum('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Eliminarea datelor din tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `birthdate`, `phone`, `created_at`, `role`) VALUES
(1, 'Mihai Cosmin', 'mihaioprea382@gmail.com', '$2y$10$azz9Zvg894tMDpmWi6coK.mfrY3zqWeV/ljVjFpFGXbMAy.xEsVzG', '2009-05-15', '0750669450', '2026-10-09 12:44:15', 'admin');

--
-- Indexuri pentru tabele eliminate
--

--
-- Indexuri pentru tabele `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexuri pentru tabele `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexuri pentru tabele `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`);

--
-- Indexuri pentru tabele `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_approved` (`approved`);

--
-- Indexuri pentru tabele `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pentru tabele eliminate
--

--
-- AUTO_INCREMENT pentru tabele `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pentru tabele `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pentru tabele `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pentru tabele `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pentru tabele `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
