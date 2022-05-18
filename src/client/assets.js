// Don't know why the relative path "/assets/xxx.svg"
// is unsolvable, so here we use url instead.
const IMG_DIC = {
  'ship.svg': 'https://www.svgrepo.com/show/285107/ufo-alien.svg',
  'bullet.svg': 'https://www.svgrepo.com/show/178753/bullet-weapons.svg',
  'airplane.svg': 'https://www.svgrepo.com/show/80401/airplane.svg',
  'alien.svg': 'https://www.svgrepo.com/show/217217/alien.svg',
  'background.jpg':
    'https://img.freepik.com/free-vector/flat-design-planet-collection-around-sun_52683-23859.jpg?t=st=1652535566~exp=1652536166~hmac=860caefc555d6e400d3cf09b96bab5bb246921a7188818cfffd875bc02cdfe74&w=2000',
  //'https://kurzgesagt.org/wp-content/uploads/2018/07/inanutshell-kurzgesagt-optimistic-nihilism-05.png',
  //'https://m.media-amazon.com/images/I/81tOChsWFRL._AC_SL1500_.jpg',
}

const ASSET_NAMES = [
  'ship.svg',
  'bullet.svg',
  'airplane.svg',
  'alien.svg',
  'background.jpg',
]

const assets = {}

function downloadAsset(assetName) {
  return new Promise((resolve) => {
    const asset = new Image()
    asset.onload = () => {
      console.log(`Downloaded ${assetName}`)
      assets[assetName] = asset
      resolve()
    }
    asset.src = IMG_DIC[assetName]
  })
}

export const downloadAssets = () => Promise.all(ASSET_NAMES.map(downloadAsset))

export const getAsset = (assetName) => assets[assetName]
