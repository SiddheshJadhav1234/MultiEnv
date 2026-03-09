const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'user') {
    return (
      <div className="skeleton-user">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-content">
          <div className="skeleton-line skeleton-line-title"></div>
          <div className="skeleton-line skeleton-line-subtitle"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-line-title"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
    </div>
  );
};

export default LoadingSkeleton;
