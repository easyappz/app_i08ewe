import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div data-easytag="id1-src/pages/NotFound.jsx" style={{ padding: 24 }}>
      <Result
        status="404"
        title="404"
        subTitle="Страница не найдена"
        extra={<Button type="primary"><Link to="/">На главную</Link></Button>}
      />
    </div>
  );
}

export default NotFound;
