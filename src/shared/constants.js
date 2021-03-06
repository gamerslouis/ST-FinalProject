module.exports = Object.freeze({
  PLAYER_RADIUS: 50,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 50,
  PLAYER_ORIGIN_POS_X: 50,
  PLAYER_ORIGIN_POS_Y: 50,
  MOVE_DELTA_RAD: ((2 * Math.PI) / 360) * 1,

  BULLET_RADIUS: 3,
  BULLET_SPEED: 1000,
  BULLET_DAMAGE: 10,
  MAP_SIZE: 1000,
  BULLET_RELOAD: 1000,

  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    INPUT: 'input',
    GAME_UPDATE: 'update',
    GAME_OVER: 'dead',
  },
  INPUT_EVENTS: {
    MOUSE: 'mouse',
    SPACE: 'space',
    LEFT_ARROW_KEY: 'left_arrow_key',
    RIGHT_ARROW_KEY: 'right_arrow_key',
  },
})
