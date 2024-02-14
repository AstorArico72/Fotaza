-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 14-02-2024 a las 14:57:44
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
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
  `URL_Miniatura` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `Etiquetas_Post` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `Licencia_Foto` varchar(32) COLLATE utf8_bin DEFAULT NULL,
  `Categoría_Post` varchar(32) COLLATE utf8_bin DEFAULT NULL,
  `Visibilidad` varchar(10) COLLATE utf8_bin NOT NULL DEFAULT 'Público',
  `createdAt` datetime DEFAULT current_timestamp() COMMENT 'De momento es necesario para operar con Sequelize ORM',
  `updatedAt` datetime DEFAULT current_timestamp() COMMENT 'De momento es necesario para operar con Sequelize ORM'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Usuarios`
--
ALTER TABLE `Usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
