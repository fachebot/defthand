import dotenv from "dotenv"
import { ethers } from "ethers"
import BigNumber from "bignumber.js"
import { ERC20, Router02 } from "./abi"

dotenv.config()

const {
    NODE_URL,
    PRIVATE_KEY,
    WETH,
    TOKEN,
    TYPE,
    ROUTER,
    VALUE,
    EXCHANGE_RATE,
} = process.env

async function uniswapv2() {
    const provider = new ethers.JsonRpcProvider(NODE_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY as string, provider)

    const address = await wallet.getAddress()
    const token = new ethers.Contract(TOKEN as string, ERC20, wallet)
    const router = new ethers.Contract(ROUTER as string, Router02, wallet)

    const path = [WETH as string, TOKEN as string]
    const options = { value: ethers.parseEther(VALUE as string) }

    const value = new BigNumber(VALUE as string)
    const decimals = new BigNumber(await token.decimals())
    const exchangeRate = ethers.parseUnits(EXCHANGE_RATE as string, decimals.toNumber())
    const amountOutMin = value.multipliedBy(new BigNumber(exchangeRate.toString())).toFixed(0)

    while (true) {
        try {
            const deadline = Math.floor(Date.now() / 1000) + 60 * 5
            const tx = await router.swapExactETHForTokens(amountOutMin, path, address, deadline, options)
            console.info(tx.hash)
            break
        } catch (error: any) {
            console.info(new Date(), error.message)
        }
    }
}

async function camelot() {
    const provider = new ethers.JsonRpcProvider(NODE_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY as string, provider)

    const address = await wallet.getAddress()
    const token = new ethers.Contract(TOKEN as string, ERC20, wallet)
    const router = new ethers.Contract(ROUTER as string, Router02, wallet)

    const path = [WETH as string, TOKEN as string]
    const options = { value: ethers.parseEther(VALUE as string) }

    const value = new BigNumber(VALUE as string)
    const decimals = new BigNumber(await token.decimals())
    const referrer = "0x0000000000000000000000000000000000000000"
    const exchangeRate = ethers.parseUnits(EXCHANGE_RATE as string, decimals.toNumber())
    const amountOutMin = value.multipliedBy(new BigNumber(exchangeRate.toString())).toFixed(0)

    while (true) {
        try {
            const deadline = Math.floor(Date.now() / 1000) + 60 * 5
            const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(amountOutMin, path, address, referrer, deadline, options)
            console.info(tx.hash)
            break
        } catch (error: any) {
            console.info(new Date(), error.message)
        }
    }
}

(async () => {
    if (TYPE === 'uniswapv2') {
        await uniswapv2()
    } else if (TYPE === 'camelot') {
        await camelot()
    }
})()
