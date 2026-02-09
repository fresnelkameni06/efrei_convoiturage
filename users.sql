-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 09 fév. 2026 à 21:56
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `efrei_covoiturage`
--

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `role` enum('passager','conducteur') NOT NULL,
  `dateCreation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `password_hash`, `telephone`, `role`, `dateCreation`) VALUES
(1, 'dqffc', 'fdqecf', 'squdbuyqd@gmail.com', '$2b$10$MhoUwSgawL6s6Bl8CY9ileB3Rhkz81lTHHYlPEsmkpsxCzS8KE/yC', '569858', 'passager', '2025-11-24 02:35:53'),
(2, 'cheuwebe', 'fresnel', 'fresnelkameni09@gmail.com', '$2b$10$CFcaGwagmtu2ZNl4P1dHLO3y8zxIxRTFCzySWTktJpFsqgimer3IW', '657483922', 'passager', '2025-11-24 02:39:07'),
(3, 'ndate', 'armand', 'fresnelkameni07@gmail.com', '$2b$10$guGw9vNxRwJvldf82ntSJ.3HxzSCKLDBd3gsAGMknA6gY8iuf229q', '654898778', 'conducteur', '2025-11-24 02:40:31'),
(5, 'dedec', 'frefre', 'fresnelkameni10@gmail.com', '$2b$10$5kukZST0lcVd2mNki8FDae3Si647yGFkF6zGmwtX20kNsth/yfBDC', '7845122', 'conducteur', '2025-11-24 02:51:18'),
(6, 'lesly ', 'lauwa', 'fresnelkameni11@gmail.com', '$2b$10$6iJzVoT3qySXMx3iuaRRJ.dfc2r2wvzGDKAGJFbJhDGho40REUr4C', '654545454', 'passager', '2025-11-24 03:54:56'),
(7, 'fresnel', 'junior', 'fresnelkameni56@gmail.com', '$2b$10$Q0T1L9C9RF2bvxaqk70cTOI3y.gi.e5ifabV/cH0H6JLGqaPOKCea', '0748589865', 'passager', '2025-11-25 14:22:36');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
