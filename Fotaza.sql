-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 18-11-2023 a las 19:03:41
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `Fotaza`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Comentarios`
--

CREATE TABLE `Comentarios` (
  `ID` int(11) NOT NULL,
  `ID_Post` int(11) NOT NULL,
  `ID_Usuario` int(11) NOT NULL,
  `Texto_Comentario` varchar(20000) COLLATE utf8_bin NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Posts`
--

CREATE TABLE `Posts` (
  `id` int(11) NOT NULL,
  `Usuario` int(11) NOT NULL,
  `Texto_Post` varchar(20000) COLLATE utf8_bin NOT NULL,
  `Título_Post` varchar(255) COLLATE utf8_bin NOT NULL,
  `URL_Medios` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `Etiquetas_Post` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `Licencia_Foto` varchar(32) COLLATE utf8_bin DEFAULT NULL,
  `Categoría_Post` varchar(32) COLLATE utf8_bin DEFAULT NULL,
  `Visibilidad` varchar(10) COLLATE utf8_bin NOT NULL DEFAULT 'Público',
  `createdAt` date DEFAULT current_timestamp() COMMENT 'De momento es necesario para operar con Sequelize ORM',
  `updatedAt` date DEFAULT current_timestamp() COMMENT 'De momento es necesario para operar con Sequelize ORM'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `Posts`
--

INSERT INTO `Posts` (`id`, `Usuario`, `Texto_Post`, `Título_Post`, `URL_Medios`, `Etiquetas_Post`, `Licencia_Foto`, `Categoría_Post`, `Visibilidad`, `createdAt`, `updatedAt`) VALUES
(1, 1, '<h1>¡Bienvenido!</h1>\r\n<p>\r\nÉste es el proyecto final para Laboratorio de Programación II. <br>\r\nAntes de comenzar a usar Fotaza, lee los términos de uso, y la guía de HTML y formato. <br>\r\nÉste trabajo no está bajo ninguna licencia, por lo que se pide que no sea publicado.\r\n</p>', 'Bienvenido a Fotaza', NULL, 'Modpost', 'CC-BY-NC-ND', NULL, 'Público', '2023-11-18', '2023-11-18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Usuarios`
--

CREATE TABLE `Usuarios` (
  `id` int(11) NOT NULL,
  `Nombre_Usuario` varchar(255) COLLATE utf8_bin NOT NULL,
  `Contraseña` varchar(255) COLLATE utf8_bin NOT NULL,
  `Rol` varchar(5) COLLATE utf8_bin DEFAULT 'User',
  `Perfil_Usuario` varchar(20000) COLLATE utf8_bin DEFAULT NULL,
  `createdAt` date NOT NULL DEFAULT current_timestamp() COMMENT 'De momento es necesario para operar con Sequelize ORM',
  `updatedAt` date NOT NULL DEFAULT current_timestamp() COMMENT 'De momento es necesario para operar con Sequelize ORM'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `Usuarios`
--

INSERT INTO `Usuarios` (`id`, `Nombre_Usuario`, `Contraseña`, `Rol`, `Perfil_Usuario`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', '$2b$10$ktLnVpwcsBPl7OztH.F.6emKq/gSx7sMmNFMsT2K9CTFAMigteU0i', 'User', '<h1> Astor Aricó </h1>\r\n<p>\r\nCreador y adminstrador de Fotaza\r\n</p>', '2023-11-18', '2023-11-18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Votos`
--

CREATE TABLE `Votos` (
  `Post` int(11) NOT NULL,
  `Votos5` int(11) DEFAULT 0,
  `Votos4` int(11) DEFAULT 0,
  `Votos3` int(11) DEFAULT 0,
  `Votos2` int(11) DEFAULT 0,
  `Votos1` int(11) DEFAULT 0,
  `Votos0` int(11) DEFAULT 0,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `VotosUsuarios`
--

CREATE TABLE `VotosUsuarios` (
  `Usuario` int(11) NOT NULL,
  `Post` int(11) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Comentarios`
--
ALTER TABLE `Comentarios`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Comentario-Post` (`ID_Post`),
  ADD KEY `Comentario-Usuario` (`ID_Usuario`);

--
-- Indices de la tabla `Posts`
--
ALTER TABLE `Posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Usuario` (`Usuario`);

--
-- Indices de la tabla `Usuarios`
--
ALTER TABLE `Usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `Votos`
--
ALTER TABLE `Votos`
  ADD UNIQUE KEY `Post_2` (`Post`),
  ADD KEY `Post` (`Post`);

--
-- Indices de la tabla `VotosUsuarios`
--
ALTER TABLE `VotosUsuarios`
  ADD KEY `Post` (`Post`),
  ADD KEY `Usuario` (`Usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Comentarios`
--
ALTER TABLE `Comentarios`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Posts`
--
ALTER TABLE `Posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `Usuarios`
--
ALTER TABLE `Usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Comentarios`
--
ALTER TABLE `Comentarios`
  ADD CONSTRAINT `Comentarios_ibfk_1` FOREIGN KEY (`ID_Post`) REFERENCES `Posts` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Comentarios_ibfk_2` FOREIGN KEY (`ID_Usuario`) REFERENCES `Usuarios` (`ID`);

--
-- Filtros para la tabla `Posts`
--
ALTER TABLE `Posts`
  ADD CONSTRAINT `Posts_ibfk_1` FOREIGN KEY (`Usuario`) REFERENCES `Usuarios` (`ID`);

--
-- Filtros para la tabla `Votos`
--
ALTER TABLE `Votos`
  ADD CONSTRAINT `VotosPost` FOREIGN KEY (`Post`) REFERENCES `Posts` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `VotosUsuarios`
--
ALTER TABLE `VotosUsuarios`
  ADD CONSTRAINT `VotosUsuarios_ibfk_1` FOREIGN KEY (`Usuario`) REFERENCES `Usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `VotosUsuarios_ibfk_2` FOREIGN KEY (`Post`) REFERENCES `Posts` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
