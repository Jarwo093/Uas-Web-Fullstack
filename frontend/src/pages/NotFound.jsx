import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="auth-layout" style={{ background: 'var(--bg-app)' }}>
      <div className="empty-state">
        <div className="empty-icon">
          <FileQuestion size={28} />
        </div>
        <h3>Page not found</h3>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <Button variant="primary">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
