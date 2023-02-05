/* eslint-disable import/no-extraneous-dependencies */
import * as PushAPI from '@pushprotocol/restapi';
import { ChangeEvent, useContext, useState, useEffect} from 'react';
import styled from 'styled-components';
import { Web3Storage } from 'web3.storage';
// const lighthouse = require('@lighthouse-web3/sdk');
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  sendHello,
  showNotifications,
  uploadFile,
} from '../utils';
import {
  ConnectButton,
  UploadFileInput,
  SendHelloButton,
  Card,
  Push,
  ShowNotificationsButton,
} from '../components';
import MarketAPI from '../components/MarketAPI.json';
import ethers from 'ethers';
import { log } from 'console';

// const TOKEN = process.env.WEB3_STORAGE_API_KEY;
const TOKEN ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFGODgxYzFFNGE5RTdjRkJmZTliMzA2OTQxMDk1QTk4NjZlNTIzOEEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzU1NDY1NTIyODAsIm5hbWUiOiJ3M3MifQ.tDAD3Bqt9VRQXgyZLGaNitMg-ZW7Ubo1TwdLINvw3ng';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [address, setAddress] = useState('');
  const [userDeals, setuserDeals] = useState<any[]>([]);

  useEffect(() => {
      async function checkData() {
        const userDeals = await getUserDeals();
        setuserDeals(userDeals);
        console.log(userDeals);
      }
      
      checkData()
  }, [])

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      await getUserAddress();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  function jsonFile(filename: string, obj: { path: string; caption?: string }) {
    return new File([JSON.stringify(obj)], filename);
  }

  function makeGatewayURL(cid: string, path: string) {
    return `https://${cid}.ipfs.dweb.link/${encodeURIComponent(path)}`;
  }

  function updateUploadInfo(
    cid: string,
    metadataGatewayURL: string,
    imageGatewayURL: string,
    imageURI: string,
    metadataURI: string,
  ) {
    console.log(cid);
    console.log(metadataGatewayURL);
    console.log(imageGatewayURL);
    console.log(imageURI);
    console.log(metadataURI);
  }

  const handleShowNotificationsClick = async () => {
    try {
      await showNotifications();
      await fetchNotifications();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  async function getUserAddress() {
    try {
      window.ethereum
        .request({
          method: 'wallet_enable',
          // This entire object is ultimately just a list of requested permissions.
          // Every snap has an associated permission or permissions, given the prefix `wallet_snap_`
          // and its ID. Here, the `wallet_snap` property exists so that callers don't
          // have to specify the full permission permission name for each snap.
          params: [
            {
              wallet_snap: {
                'npm:@metamask/example-snap': {},
                'npm:fooSnap': {
                  // The optional version argument allows requesting
                  // SemVer version range, with semantics same as in
                  // package.json ranges.
                  version: '^1.0.2',
                },
              },
              eth_accounts: {},
            },
          ],
        })
        .then((res) => {
          if ((res as { accounts: string[] }) !== null) {
            setAddress((res as { accounts: string[] }).accounts[0]);
          }
        });
    } catch (error) {
      // The `wallet_enable` call will throw if the requested permissions are
      // rejected.
      if (error.code === 4001) {
        console.log('The user rejected the request.');
      } else {
        console.log('Unexpected error:', error);
      }
    }
  }

  async function getUserDeals() {
    try{  
      await (window as any)?.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + (31415).toString(16) }],
    });

    const provider = new ethers.providers.Web3Provider((window as any)?.ethereum)
    const marketAPI = new ethers.Contract('0xE6c8B03F05DE24C3cBF2F1792f7780fceD9805AF', MarketAPI.abi, provider);

    const userDeals = await marketAPI.get_deals_of_user();
    return userDeals;
    }catch(error){
      console.log(error);
    }
  }

  async function fetchNotifications(): Promise<string> {
    if (address === '') {
      await getUserAddress();
    }
    console.log(`eip155:5:${address}`);
    const fetchedNotifications = await PushAPI.user.getFeeds({
      user: `eip155:5:${address}`,
      env: 'staging',
    });
    let msg;
    
    if (fetchedNotifications) {
      msg = `You have ${fetchedNotifications.length} notifications\n`;
      for (let i = 0; i < fetchedNotifications.length; i++) {
        msg += `${fetchedNotifications[i].title} ${fetchedNotifications[i].message}\n`;
      }
    } else {
      msg = 'You have 0 notifications';
    }
    console.log(msg);
    return msg;
  }

  const handleUpload = async (e: InputEvent) => {
    const namePrefix = 'ImageGallery';

    const { files } = e.target as HTMLInputElement;
    if (files === null || files.length < 1) {
      console.log('nothing selected');
      return;
    }
    
    
    try {
      const uploadName = [namePrefix, ''].join('|');
      const web3storage = new Web3Storage({ token: TOKEN });
      // const apiKey:string = "680bace4-845f-4f97-b8b7-fe9f36052142";
      // const uploadResponse = await lighthouse.upload(files[0], apiKey);
      // console.log(uploadResponse);
      
      const imageFile = files[0];
      const metadataFile = jsonFile('metadata.json', { path: imageFile.name });

      const cid = await web3storage.put([imageFile, metadataFile], {
        name: uploadName,

        onRootCidReady: (localCid: string) => {
          console.log('Local CID: ', localCid);
        },

        onStoredChunk: (bytes: any) =>
          console.log(`sent ${bytes.toLocaleString()} bytes to web3.storage`),
      });
      const uploadNames = []
      for await (const item of web3storage.list({ maxResults: 10 })) {
        uploadNames.push(item.name);
      }
      console.log(uploadNames);

      const metadataGatewayURL = makeGatewayURL(cid, 'metadata.json');
      const imageGatewayURL = makeGatewayURL(cid, imageFile.name);
      const imageURI = `ipfs://${cid}/${imageFile.name}`;
      const metadataURI = `ipfs://${cid}/metadata.json`;
      updateUploadInfo(
        cid,
        metadataGatewayURL,
        imageGatewayURL,
        imageURI,
        metadataURI,
      );

      await uploadFile();
    } catch (err) {
      console.error(err);
      dispatch({ type: MetamaskActions.SetError, payload: err });
    }
  };

  const getInputValue = (event: ChangeEvent) => {
    const userValue = event.target.value;
    console.log(userValue);
  };
  return (
    <Container>
    
      {address.length > 0 && <Push account={address} />}

      <CardContainer>
       
        <Card
          content={{
            title: 'Upload file',
            description: 'Powered by Light House',
            button: (
              <UploadFileInput
                onChange={handleUpload}
              />
            ),
          }}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) 
          }
        />
        <Card
          content={{
            title: 'Fetch Notifications',
            description: 'Powered by PUSH',
            button: (
              <ShowNotificationsButton
                onClick={handleShowNotificationsClick}
                
              />
            ),
          }}
          
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) 
          }
        />
        <Card
          content={{
            title: 'Send Customised message',
            description:
              'Confirm message via MetaMask',
            button: (
              <SendHelloButton
                onClick={handleSendHelloClick}
              />
            ),
          }}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) 
          }
        />
      </CardContainer>
    </Container>
  );
};

export default Index;
