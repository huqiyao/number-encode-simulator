import React, { useState, useMemo } from 'react';
import { Input, Button, Typography, Select, Radio, Space } from 'antd';
import './App.css';

const CHAR_LIST = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
const App: React.FC = () => {
  const [numberString, setNumberString] = useState('');
  const [formula, setFormula] = useState('');
  const [rules, setRules] = useState([]);
  const isValidated = useMemo(
    () => numberString && formula && rules.length === 10,
    [numberString, formula, rules]
  );
  return (
    <div className="container">
      <div className="side">side</div>
      <main className="main">
        <h2>数字编码函数模拟仿真</h2>
        <div>
          <Typography.Title level={4}>编码规则</Typography.Title>
          <div className="rules">
            {Array.from({ length: 10 }, (_, index) => {
              const current = rules.find((rule) => rule.key === index);
              return (
                <div className="rule-item" key={index}>
                  <div className="rule-number">{index}:</div>
                  <Radio.Group
                    size="large"
                    onChange={(e) => {
                      const newRules = [...rules];
                      if (current) {
                        const currentIndex = rules.findIndex((rule) => rule.key === index);
                        newRules[currentIndex] = { key: index, value: e.target.value };
                      } else {
                        newRules.push({ key: index, value: e.target.value });
                      }
                      setRules(newRules);
                    }}
                    value={current?.value}
                    className="radio-group"
                  >
                    {CHAR_LIST.map((char) => (
                      <Radio.Button value={char} key={char} className="radio">
                        {char}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <Typography.Title level={4}>编码公式</Typography.Title>
          <Input
            placeholder="输入公式"
            size="large"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
          />
        </div>
        <div className="editor">
          <div className="textarea-container">
            <Typography.Title level={4}>输入数字串</Typography.Title>
            <Input.TextArea
              className="textarea"
              onChange={(e) => setNumberString(e.target.value.replace(/\D/g, ''))}
              value={numberString}
            />
          </div>
          <Button type="primary" size="large" disabled={!isValidated}>
            编码
          </Button>
          <div className="textarea-container">
            <Typography.Title level={4}>输出编码</Typography.Title>
            <Input.TextArea disabled />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
