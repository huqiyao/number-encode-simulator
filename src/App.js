import React, { useState, useMemo, useCallback } from 'react';
import { Input, Button, Typography, Select, Radio, Space, Tooltip } from 'antd';
import { ReactComponent as ResetIcon } from './reset.svg';
import { ReactComponent as DownloadIcon } from './download.svg';
import { ReactComponent as CopyIcon } from './copy.svg';
import './App.css';

const CHAR_LIST = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
const getNewRecordList = (value) => {
  const recordList = JSON.parse(localStorage.getItem('recordList') || '[]');
  recordList.push({
    date: new Date(),
    value: value,
  });
  return recordList;
};
const formatDateString = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
const App: React.FC = () => {
  const [numberString, setNumberString] = useState('');
  const [formula, setFormula] = useState('');
  const [rules, setRules] = useState([]);
  const [encodedString, setEncodedString] = useState('');
  const [recordList, setRecordList] = useState(
    JSON.parse(localStorage.getItem('recordList') || '[]')
  );
  const isValidated = useMemo(
    () => numberString && formula && rules.length === 10,
    [numberString, formula, rules]
  );
  const reset = useCallback(() => {
    setNumberString('');
    setFormula('');
    setRules([]);
    setEncodedString('');
  });
  const download = useCallback(() => {
    const fileName = 'encode-file';
    const json = JSON.stringify({ numberString, formula, rules, encodedString }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }, [numberString, formula, rules, encodedString]);
  const copyToClipboard = useCallback((v) => {
    navigator.clipboard.writeText(v);
  });
  return (
    <div className="container">
      <div className="side">
        {recordList.map((record, index) => (
          <div
            key={index}
            className="record"
            onClick={() => {
              setNumberString(record.value.numberString);
              setRules(record.value.rules);
              setFormula(record.value.formula);
              setEncodedString(record.value.encodedString);
            }}
          >
            <div className="record-date">{formatDateString(record.date)}</div>
            <div className="record-value">{record.value.numberString}</div>
          </div>
        ))}
      </div>
      <main className="main">
        <h2>数字编码函数模拟仿真</h2>
        <div className="icon-list">
          <Tooltip title="重置">
            <ResetIcon className="icon" onClick={reset} />
          </Tooltip>
          <Tooltip title="导出">
            <DownloadIcon className="icon" onClick={download} />
          </Tooltip>
        </div>
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
          <Button
            type="primary"
            size="large"
            disabled={!isValidated}
            onClick={() => {
              const newRecordlist = getNewRecordList({
                numberString,
                formula,
                rules,
                encodedString: undefined,
              });
              setRecordList(newRecordlist);
              localStorage.setItem('recordList', JSON.stringify(newRecordlist));
            }}
          >
            编码
          </Button>
          <div className="textarea-container">
            <Typography.Title level={4}>输出编码</Typography.Title>
            <div className="wrapper">
              <Input.TextArea disabled value={encodedString} />
              {!!encodedString && (
                <CopyIcon className="copy-icon" onClick={() => copyToClipboard(encodedString)} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default App;
