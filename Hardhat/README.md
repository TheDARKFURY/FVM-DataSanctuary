# FEVM Hardhat Kit
//f410faplklkwqggulrbattfm3ttv4yahmoxxbfofquai -> Address 
## Cloning the Repo

Open up your terminal (or command prompt) and navigate to a directory you would like to store this code on. Once there type in the following command:


```
git clone https://github.com/filecoin-project/FEVM-Hardhat-Kit.git
cd FEVM-hardhat-kit
yarn install
```

This will clone the hardhat kit onto your computer, switch directories into the newly installed kit, and install the dependencies the kit needs to work.

## Add your Private Key as an Environment Variable

Add your private key as an environment variable by running this command: 
 
 ```
export PRIVATE_KEY='abcdef'
```

 \
If you use a .env file, don't commit and push any changes to .env files that may contain sensitive information, such as a private key! If this information reaches a public GitHub repository, someone can use it to check if you have any Mainnet funds in that wallet address, and steal them!


## Get the Deployer Address

Run this command:
```
yarn hardhat get-address
```

The f4address is the filecoin representation of your Ethereum address. This will be needed for the faucet in the next step.

The Ethereum address will be used otherwise.

Type in the following command in the terminal: 
 
 ```
yarn hardhat deploy
```

This will compile the contract and deploy it to the HyperSpace network automatically!

Keep note of the deployed contract address for the next step.
 
 ```
yarn hardhat get-balance --contract 'THE DEPLOYED CONTRACT ADDRESS HERE' --account 'YOUR Ethereum ADDRESS HERE'
```
