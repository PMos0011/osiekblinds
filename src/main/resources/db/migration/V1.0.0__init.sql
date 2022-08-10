CREATE TABLE schedule_actions
(
    id        bigint        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    plan_name nvarchar(255) NOT NULL,
    up        DATETIME      NOT NULL,
    down      DATETIME      NOT NULL,
    active    tinyint       NOT NULL
);

CREATE TABLE day_definitions
(
    id         int          NOT NULL PRIMARY KEY,
    short_name nvarchar(2)  NOT NULL,
    day_name   nvarchar(15) NOT NULL
);

CREATE TABLE blinds_definitions
(
    id         int          NOT NULL PRIMARY KEY,
    blind_name nvarchar(15) NOT NULL,
    direction  varchar(4)   NOT NULL,
    move_time  decimal      NOT NULL,
    position   decimal      NOT NULL,
    global     tinyint      NOT NULL
);

CREATE TABLE blind_schedule
(
    schedule_id bigint NOT NULL,
    blind_id    int    NOT NULL
);

CREATE TABLE day_schedule
(
    schedule_id bigint NOT NULL,
    day_id      int    NOT NULL
);

CREATE TABLE blind_move_data
(
    id          bigint      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    engin_state varchar(10) NOT NULL,
    top_led     varchar(10) NOT NULL,
    bottom_led  varchar(10) NOT NULL,
    action_time timestamp   NOT NULL
)