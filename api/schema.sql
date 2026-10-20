CREATE DATABASE IF NOT EXISTS aventure_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE aventure_db;

CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    birthdate   DATE          NOT NULL,
    role        ENUM('user','admin') NOT NULL DEFAULT 'user',
    created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reservations (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(150) NOT NULL,
    phone        VARCHAR(30)  NOT NULL,
    offer_id     VARCHAR(100) NOT NULL,
    offer_title  VARCHAR(255) NOT NULL DEFAULT '',
    message      TEXT,
    status       ENUM('noua','in_progres','confirmata','anulata') NOT NULL DEFAULT 'noua',
    created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS offers (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    slug             VARCHAR(100) NOT NULL UNIQUE,
    title            VARCHAR(255) NOT NULL,
    subtitle         VARCHAR(255) NOT NULL DEFAULT '',
    category         VARCHAR(100) NOT NULL,
    destination      VARCHAR(150) NOT NULL,
    country          VARCHAR(100) NOT NULL DEFAULT '',
    duration_days    INT          NOT NULL DEFAULT 1,
    duration_nights  INT          NOT NULL DEFAULT 0,
    price_ron        INT          NOT NULL DEFAULT 0,
    image_url        VARCHAR(500) NOT NULL DEFAULT '',
    short_desc       TEXT,
    full_desc        TEXT,
    difficulty       VARCHAR(50)  NOT NULL DEFAULT 'Ușor',
    transport        VARCHAR(150) NOT NULL DEFAULT '',
    accommodation    VARCHAR(150) NOT NULL DEFAULT '',
    featured         TINYINT(1)   NOT NULL DEFAULT 0,
    created_at       DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('user','admin') NOT NULL DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(30) NOT NULL DEFAULT '' AFTER birthdate;

CREATE TABLE IF NOT EXISTS chat_messages (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT          NOT NULL,
    sender      ENUM('user','admin') NOT NULL,
    message     TEXT         NOT NULL,
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reviews (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT          NOT NULL,
    rating     TINYINT      NOT NULL DEFAULT 5,
    body       TEXT         NOT NULL,
    offer_id   VARCHAR(100) NOT NULL DEFAULT '',
    approved   TINYINT(1)   NOT NULL DEFAULT 0,
    created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_approved (approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
