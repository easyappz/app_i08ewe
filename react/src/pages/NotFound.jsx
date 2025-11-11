import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div data-easytag="id1-src/pages/NotFound.jsx" style={{ padding: 24 }}>
      <Result
        data-easytag="id2-src/pages/NotFound.jsx"
        status="404"
        title="404 — Страница не найдена"
        extra={(
          <Link to="/">
            <Button type="primary">На главную</Button>
          </Link>
        )}
      />
    </div>
  );
}

export default NotFound;
