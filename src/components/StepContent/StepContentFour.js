import React, { useState } from 'react';
import { Input, Form, Button, message, Checkbox } from 'antd';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';

const StepContentFour = ({
  authoried_key,
  setCurrentStep,
  token,
  setUsername,
}) => {
  const [useDefault, setUseDefault] = useState(false);
  const { Item } = Form;

  const handleSubmit = async ({ username, password }) => {
    if (useDefault) {
      setCurrentStep(4);
    } else {
      const registerInfo = { authoried_key, username, password };
      try {
        const res = await axios.post('/v1/user/register', registerInfo, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.includes('Successfully')) {
          setCurrentStep(4);
        } else {
          message.error('Server Error! Please contact administrator!');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Form
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 13 }}
      layout="horizontal"
      size="large"
      onFinish={handleSubmit}
      initialValues={{
        username: '',
        password: '',
        confirm: '',
      }}
    >
      <p
        style={{
          display: 'block',
          marginBottom: 20,
          color: 'red',
          fontSize: 18,
        }}
      >
        <FormattedMessage id="app.accountIntro" />
      </p>
      <p
        style={{
          display: 'block',
          marginBottom: 20,
          color: 'red',
          fontSize: 18,
        }}
      >
        <FormattedMessage id="app.accountSkip" />
      </p>
      <Item>
        <Checkbox
          style={{ marginLeft: 170 }}
          checked={useDefault}
          onChange={(e) => setUseDefault(e.target.checked)}
        >
          <FormattedMessage id="app.default" />
        </Checkbox>
      </Item>
      {!useDefault && (
        <>
          <Item
            name="username"
            label={
              <span>
                <FormattedMessage id="app.userName" />
              </span>
            }
            rules={[
              {
                required: true,
                message: <FormattedMessage id="app.fieldRequired" />,
              },
            ]}
          >
            <Input onChange={(e) => setUsername(e.target.value)} />
          </Item>
          <Item
            name="password"
            label={
              <span>
                <FormattedMessage id="app.password" />
              </span>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: <FormattedMessage id="app.fieldRequired" />,
              },
            ]}
          >
            <Input.Password />
          </Item>
          <Item
            name="confirm"
            label={
              <span>
                <FormattedMessage id="app.passwordConfirm" />
              </span>
            }
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: <FormattedMessage id="app.fieldRequired" />,
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    <FormattedMessage id="app.passwordsNotMatch" />
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Item>
        </>
      )}
      <div className="steps-action">
        <Button
          size="large"
          style={{ marginRight: 20 }}
          onClick={() => setCurrentStep(2)}
        >
          <FormattedMessage id="app.prev" />
        </Button>
        <Button type="primary" htmlType="submit" size="large">
          <FormattedMessage id="app.next" />
        </Button>
      </div>
    </Form>
  );
};

export default StepContentFour;
