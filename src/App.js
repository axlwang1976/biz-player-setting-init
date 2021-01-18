import { useState, useEffect, useCallback } from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Divider, Steps, Typography } from 'antd';

import './App.css';
import en from './i18n/en';
import tw from './i18n/tw';
import StepContentOne from './components/StepContent/StepContentOne';
import StepContentTwo from './components/StepContent/StepContentTwo';
import StepContentThree from './components/StepContent/StepContentThree';
import StepContentFour from './components/StepContent/StepContentFour';
import StepContentFive from './components/StepContent/StepContentFive';

const App = () => {
  const [locale, setLocale] = useState('zh');
  const [token, setToken] = useState(null);
  const [rotation, setRotation] = useState('normal');
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [deviceName, setDeviceName] = useState('');
  const [timezone, setTimezone] = useState('Asia/Taipei');
  const [contentURL, setContentURL] = useState('');
  const [username, setUsername] = useState('');
  const [apList, setApList] = useState([]);
  let messages;

  if (locale === 'zh') {
    messages = tw;
  } else {
    messages = en;
  }

  const getApList = useCallback(async () => {
    try {
      const res = await axios.get('/v1/wifi/scan_results', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApList(res.data.map((el) => el.SSID));
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const { Step } = Steps;

  const steps = [
    {
      title: <FormattedMessage id="app.langAndRotation" />,
      content: (
        <StepContentOne
          setCurrentStep={setCurrentStep}
          token={token}
          setLocale={setLocale}
          locale={locale}
          setRotation={setRotation}
        />
      ),
    },
    {
      title: <FormattedMessage id="app.basic" />,
      content: (
        <StepContentTwo
          setCurrentStep={setCurrentStep}
          token={token}
          deviceInfo={deviceInfo}
          setDeviceName={setDeviceName}
          setTimezone={setTimezone}
          setContentURL={setContentURL}
          timezone={timezone}
        />
      ),
    },
    {
      title: <FormattedMessage id="app.network" />,
      content: (
        <StepContentThree
          setCurrentStep={setCurrentStep}
          token={token}
          deviceInfo={deviceInfo}
          apList={apList}
          getApList={getApList}
        />
      ),
    },
    {
      title: <FormattedMessage id="app.account" />,
      content: (
        <StepContentFour
          authoried_key={deviceInfo && deviceInfo.eth_mac}
          setCurrentStep={setCurrentStep}
          token={token}
          setUsername={setUsername}
        />
      ),
    },
    {
      title: <FormattedMessage id="app.summary" />,
      content: (
        <StepContentFive
          deviceName={deviceName}
          timezone={timezone}
          contentURL={contentURL}
          deviceInfo={deviceInfo}
          rotation={rotation}
          username={username}
          setCurrentStep={setCurrentStep}
          token={token}
        />
      ),
    },
  ];

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await axios.post('/v1/oauth2/token', {
          grant_type: 'password',
          username: 'Bizlution',
          password: '123456',
        });
        setToken(res.data.access_token);
      } catch (error) {
        console.log(error);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      const getDeviceInfo = async () => {
        try {
          const res = await axios.get('/v1/device_info', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDeviceInfo(res.data);
          setDeviceName(res.data.eth_mac);
          setUsername(res.data.user_name);
          setLocale(res.data.language);
        } catch (error) {
          console.log(error);
        }
      };
      getDeviceInfo();
    }
  }, [token]);

  useEffect(() => {
    if (deviceInfo && !deviceInfo.wifi_mac.includes('error')) {
      getApList();
    }
  }, [getApList, deviceInfo]);

  return (
    <IntlProvider
      locale={locale}
      key={locale}
      defaultLocale="tw"
      messages={messages}
    >
      {deviceInfo && (
        <div className="background">
          <div className="container">
            <Typography.Title level={1}>
              <FormattedMessage id="app.title" />
            </Typography.Title>
            <Divider style={{ height: 3, backgroundColor: 'black' }} />
            <Steps current={currentStep}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <div className="steps-content">{steps[currentStep].content}</div>
          </div>
          <p style={{ lineHeight: 3, color: '#fff' }}>Version: 1.0.4</p>
        </div>
      )}
    </IntlProvider>
  );
};

export default App;
