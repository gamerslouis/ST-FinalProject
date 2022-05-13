// Don't know why the relative path "/assets/xxx.svg"
// is unsolvable, so here we use url instead.
const img_dic = {
  'ship.svg': 'https://www.svgrepo.com/show/285107/ufo-alien.svg',
  'bullet.svg': 'https://www.svgrepo.com/show/178753/bullet-weapons.svg',
  'airplane.svg': 'https://www.svgrepo.com/show/80401/airplane.svg',
  'alien.svg': 'https://www.svgrepo.com/show/217217/alien.svg',
  'background.jpg':
    'https://m.media-amazon.com/images/I/81tOChsWFRL._AC_SL1500_.jpg',
}

const ASSET_NAMES = [
  'ship.svg',
  'bullet.svg',
  'airplane.svg',
  'alien.svg',
  'background.jpg',
]

const assets = {}

const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset))

function downloadAsset(assetName) {
  return new Promise((resolve) => {
    const asset = new Image()
    asset.onload = () => {
      console.log(`Downloaded ${assetName}`)
      assets[assetName] = asset
      resolve()
    }
    asset.src = img_dic[assetName]
  })
}

export const downloadAssets = () => downloadPromise

export const getAsset = (assetName) => assets[assetName]
