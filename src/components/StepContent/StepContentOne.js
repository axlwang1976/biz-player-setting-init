import React from 'react';
import { Radio, Form, Button, message, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';

import MiniDp from './MiniDp/MiniDp';

const StepContentOne = ({
  setCurrentStep,
  setRotation,
  token,
  setLocale,
  locale,
}) => {
  const { Item } = Form;
  const radioStyle = {
    display: 'flex',
    color: '#fff',
    width: '200px',
    height: '120px',
  };

  const handleSubmit = async (val) => {
    try {
      const res1 = await axios.post(
        '/v1/hdmi_rotation',
        { value: val.rotation },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res2 = await axios.post(
        '/v1/dp_rotation',
        { value: val.rotation },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res3 = await axios.post(
        '/v1/language',
        { value: val.language },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (
        res1.data.includes('OK') &&
        res2.data.includes('OK') &&
        res3.data.includes('OK')
      ) {
        setCurrentStep(1);
      } else {
        message.error('Server Error! Please contact administrator!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      layout="horizontal"
      size="large"
      onFinish={handleSubmit}
      initialValues={{ language: locale, rotation: 'normal' }}
    >
      <Item
        label={
          <span>
            <FormattedMessage id="app.language" />
          </span>
        }
        name="language"
      >
        <Select style={{ width: 200 }} onChange={(val) => setLocale(val)}>
          <Select.Option value="zh">正體中文</Select.Option>
          <Select.Option value="en">English</Select.Option>
        </Select>
      </Item>
      <Item
        label={
          <span>
            <FormattedMessage id="app.dpRotation" />
          </span>
        }
        name="rotation"
      >
        <Radio.Group
          onChange={(e) => setRotation(e.target.value)}
          style={{ display: 'flex', flexWrap: 'wrap' }}
        >
          <Radio value="normal" style={{ ...radioStyle, marginBottom: 50 }}>
            <MiniDp text="Normal" />
          </Radio>
          <Radio value="left" style={{ ...radioStyle, marginBottom: 85 }}>
            <MiniDp text="Left" />
          </Radio>
          <Radio value="right" style={{ ...radioStyle, marginBottom: 50 }}>
            <MiniDp text="Right" />
          </Radio>
          <Radio value="inverted" style={radioStyle}>
            <MiniDp text="Inverted" />
          </Radio>
        </Radio.Group>
      </Item>
      <div className="steps-action">
        <Button type="primary" htmlType="submit" size="large">
          <FormattedMessage id="app.next" />
        </Button>
      </div>
    </Form>
  );
};

export default StepContentOne;
