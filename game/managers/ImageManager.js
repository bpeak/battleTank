import imgLoader from '../utils/imgLoader'
import tankImgSrc from '../../public/imgs/tank.jpg'

const ImageManager = () => {
    let tank
    const getImgs = () => {
        return ({
            tank,
        })
    }
    const load = async () => {
        try {
            tank = await imgLoader(tankImgSrc)
        } catch (err){

        }
    }
    return ({
        load,
        getImgs,
    })
}

export default ImageManager