# Data Sanctuary

Data Sanctuary is a decentralized file storage and management solution designed to provide users with secure and reliable data storage. By integrating with Metamask, one of the most popular web3 wallets, Data Sanctuary offers an easy-to-use platform for storing files on IPFS-Filecoin using the Light house storage. Files are stored in the form of storage deals, with the deal information such as id, cid, client, provider etc being stored and preserved using the DataAStorage API smart contract on FEVM. This not only ensures persistent storage but also gives users the ability to manage their storage deals and interact with the FEVM contract for added control over their files. With Data Sanctuary, individuals can enjoy the benefits of decentralized storage for their critical files and data, freeing themselves from the clutches of corporate control.

## Getting Started

1 Clone this repository
<br/>
2 Install Metamask snaps and create an account
<br/>
3 Open Hardhat folder 

   ```yarn install ```
   
   ```npx hardhat compile```
   
  ```npx hardhat deploy --network hyperspace```
  
  - After deploying the contracts onto FEVM (Using Filecoin Hyperspace network) copy the deployed to address
  
4 Open Data Sanctuary folder
  Use the address obtained earlier to interact with Contract ABI 
  
  ```yarn install ```
  
  ```yarn start```

## Description

Data Sanctuary is a decentralized file storage and management platform that provides users with a secure and reliable way to store their critical files and data. It integrates with Metamask, a popular web3 wallet, to make the process of uploading and storing files as simple and easy as possible. The platform utilizes the light house storage API to store files on IPFS-Filecoin, which ensures the persistence and security of the stored data.

Each file stored on Data Sanctuary is treated as a storage deal, with information such as the deal id, cid, client, and provider being recorded and stored on the Market API smart contract on FEVM. This smart contract not only ensures the persistent storage of the files but also gives users the ability to manage their storage deals and interact with the FEVM contract for added control over their data.

With Data Sanctuary, individuals can enjoy the benefits of decentralized storage without having to worry about corporate control over their data. The platform offers a secure and reliable solution for storing critical files, freeing users from the constraints of centralized storage solutions. Whether you're an individual looking to store personal data or a business looking to store sensitive information, Data Sanctuary provides a decentralized solution that offers complete control over your stored files.