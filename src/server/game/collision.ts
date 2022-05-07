const Constants = require('../../shared/constants')

function checkCollisionToBullets(airplanes: any[], bullets: any[]) {
  const destroyedBullets = []
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < airplanes.length; j++) {
      const bullet = bullets[i]
      const airplane = airplanes[j]
      if (
        bullet.parentId !== airplane.id &&
        airplane.distanceTo(bullet.getPosition()) <=
          Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet)
        airplane.acceptDamage(Constants.BULLET_DAMAGE)
        break
      }
    }
  }
  return destroyedBullets
}

export { checkCollisionToBullets }
