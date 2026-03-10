const EnvBadge = ({ env }) => {
  const getEnvConfig = () => {
    const configs = {
      development: { label: 'DEV', color: 'blue' },
      testing: { label: 'TEST', color: 'yellow' },
      staging: { label: 'STAGE', color: 'purple' },
      production: { label: 'PROD', color: 'green' }
    };
    return configs[env] || { label: 'UNKNOWN', color: 'gray' };
  };

  const config = getEnvConfig();

  return (
    <div className={`env-badge-corner env-${config.color}`}>
      <span className="env-dot"></span>
      {config.label}
    </div>
  );
};

export default EnvBadge;
