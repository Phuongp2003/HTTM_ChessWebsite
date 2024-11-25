-- CreateTable
CREATE TABLE `account` (
    `id` INTEGER NOT NULL,
    `uid` INTEGER NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `rToken` TEXT NULL,

    INDEX `uid`(`uid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matches` (
    `game_id` BIGINT NOT NULL,
    `player_a` INTEGER NULL,
    `player_b` INTEGER NULL,
    `current_turn` VARCHAR(10) NULL,
    `fen` TEXT NULL,
    `result` VARCHAR(255) NULL,
    `move_history` LONGTEXT NULL,
    `white_player` INTEGER NULL,

    INDEX `player_a`(`player_a`),
    INDEX `player_b`(`player_b`),
    INDEX `white_player`(`white_player`),
    PRIMARY KEY (`game_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `uid` INTEGER NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `nickname` VARCHAR(255) NOT NULL,
    `avatar` TEXT NOT NULL,
    `elo` INTEGER NOT NULL DEFAULT 0,
    `trainingStatus` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`player_a`) REFERENCES `user`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`player_b`) REFERENCES `user`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_ibfk_3` FOREIGN KEY (`white_player`) REFERENCES `user`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;
