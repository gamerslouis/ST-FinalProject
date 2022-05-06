
class Player {
  constructor(id, name){
    this.id = id;
    this.name = name;
    this.hp = 20;
    this.direction = 1
  }

  update(){
    return {
      hp: this.hp,
      direction: this.direction
    }
  }

  hitByBullet()
  {
    this.hp = this.hp - 1;
  }


}

module.exports = Player;