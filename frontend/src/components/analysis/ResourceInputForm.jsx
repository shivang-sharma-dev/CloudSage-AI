import { useState } from 'react';
import { Plus, Trash2, Server, Database, HardDrive, Box, Globe, Activity } from 'lucide-react';

const RESOURCE_TYPES = [
  { value: 'ec2', label: 'EC2 Instance', icon: Server, color: '#f59e0b' },
  { value: 'rds', label: 'RDS Database', icon: Database, color: '#4f6ef7' },
  { value: 's3', label: 'S3 Bucket', icon: HardDrive, color: '#10b981' },
  { value: 'ecs', label: 'ECS/EKS Cluster', icon: Box, color: '#8b5cf6' },
  { value: 'nat', label: 'NAT Gateway', icon: Globe, color: '#ef4444' },
  { value: 'alb', label: 'Load Balancer', icon: Activity, color: '#06b6d4' },
];

const EC2_INSTANCE_TYPES = [
  't3.micro', 't3.small', 't3.medium', 't3.large',
  'm5.large', 'm5.xlarge', 'm5.2xlarge', 'm5.4xlarge',
  'c5.large', 'c5.xlarge', 'c5.2xlarge',
  'r5.large', 'r5.xlarge', 'r5.2xlarge',
];

const RDS_INSTANCE_TYPES = [
  'db.t3.micro', 'db.t3.small', 'db.t3.medium',
  'db.r6g.large', 'db.r6g.xlarge', 'db.r6g.2xlarge',
  'db.m6g.large', 'db.m6g.xlarge',
];

const REGIONS = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-central-1', 'ap-south-1',
  'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1',
];

function EC2Fields({ resource, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="form-label">Instance Type</label>
        <select className="form-input" value={resource.instance_type || ''} onChange={e => onChange('instance_type', e.target.value)}>
          <option value="">Select type...</option>
          {EC2_INSTANCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">Count</label>
        <input type="number" className="form-input" min="1" value={resource.count || 1} onChange={e => onChange('count', e.target.value)} placeholder="1" />
      </div>
      <div>
        <label className="form-label">Region</label>
        <select className="form-input" value={resource.region || ''} onChange={e => onChange('region', e.target.value)}>
          <option value="">Select region...</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">Usage Hours/Month</label>
        <input type="number" className="form-input" min="1" max="744" value={resource.usage_hours || 744} onChange={e => onChange('usage_hours', e.target.value)} placeholder="744" />
      </div>
    </div>
  );
}

function RDSFields({ resource, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="form-label">Instance Type</label>
        <select className="form-input" value={resource.instance_type || ''} onChange={e => onChange('instance_type', e.target.value)}>
          <option value="">Select type...</option>
          {RDS_INSTANCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">Storage (GB)</label>
        <input type="number" className="form-input" min="20" value={resource.storage_gb || 100} onChange={e => onChange('storage_gb', e.target.value)} placeholder="100" />
      </div>
      <div className="flex items-center gap-2 pt-5">
        <input type="checkbox" id="multi-az" className="w-4 h-4 accent-indigo-500" checked={resource.multi_az || false} onChange={e => onChange('multi_az', e.target.checked)} />
        <label htmlFor="multi-az" className="form-label mb-0">Multi-AZ</label>
      </div>
      <div>
        <label className="form-label">Region</label>
        <select className="form-input" value={resource.region || ''} onChange={e => onChange('region', e.target.value)}>
          <option value="">Select region...</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
    </div>
  );
}

function S3Fields({ resource, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="form-label">Storage (GB)</label>
        <input type="number" className="form-input" min="1" value={resource.storage_gb || 1000} onChange={e => onChange('storage_gb', e.target.value)} placeholder="1000" />
      </div>
      <div>
        <label className="form-label">Requests/Month (thousands)</label>
        <input type="number" className="form-input" min="0" value={resource.requests_k || 100} onChange={e => onChange('requests_k', e.target.value)} placeholder="100" />
      </div>
      <div>
        <label className="form-label">Data Transfer Out (GB)</label>
        <input type="number" className="form-input" min="0" value={resource.transfer_gb || 50} onChange={e => onChange('transfer_gb', e.target.value)} placeholder="50" />
      </div>
      <div>
        <label className="form-label">Storage Class</label>
        <select className="form-input" value={resource.storage_class || 'standard'} onChange={e => onChange('storage_class', e.target.value)}>
          <option value="standard">Standard</option>
          <option value="intelligent">Intelligent-Tiering</option>
          <option value="infrequent">Standard-IA</option>
          <option value="glacier">Glacier</option>
        </select>
      </div>
    </div>
  );
}

function ECSFields({ resource, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="form-label">Task Count</label>
        <input type="number" className="form-input" min="1" value={resource.task_count || 4} onChange={e => onChange('task_count', e.target.value)} placeholder="4" />
      </div>
      <div>
        <label className="form-label">CPU (vCPU per task)</label>
        <select className="form-input" value={resource.cpu || '1'} onChange={e => onChange('cpu', e.target.value)}>
          {['0.25','0.5','1','2','4','8','16'].map(v => <option key={v} value={v}>{v} vCPU</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">Memory (GB per task)</label>
        <select className="form-input" value={resource.memory || '2'} onChange={e => onChange('memory', e.target.value)}>
          {['0.5','1','2','4','8','16','30'].map(v => <option key={v} value={v}>{v} GB</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">Compute Type</label>
        <select className="form-input" value={resource.compute_type || 'fargate'} onChange={e => onChange('compute_type', e.target.value)}>
          <option value="fargate">Fargate</option>
          <option value="fargate_spot">Fargate Spot</option>
          <option value="ec2">EC2</option>
        </select>
      </div>
    </div>
  );
}

function NATFields({ resource, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="form-label">Data Processed (GB/month)</label>
        <input type="number" className="form-input" min="0" value={resource.data_processed_gb || 500} onChange={e => onChange('data_processed_gb', e.target.value)} placeholder="500" />
      </div>
      <div>
        <label className="form-label">Number of NAT Gateways</label>
        <input type="number" className="form-input" min="1" value={resource.count || 1} onChange={e => onChange('count', e.target.value)} placeholder="1" />
      </div>
      <div>
        <label className="form-label">Region</label>
        <select className="form-input" value={resource.region || ''} onChange={e => onChange('region', e.target.value)}>
          <option value="">Select region...</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
    </div>
  );
}

function ALBFields({ resource, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="form-label">Type</label>
        <select className="form-input" value={resource.alb_type || 'alb'} onChange={e => onChange('alb_type', e.target.value)}>
          <option value="alb">ALB (Application)</option>
          <option value="nlb">NLB (Network)</option>
        </select>
      </div>
      <div>
        <label className="form-label">LCUs/Month</label>
        <input type="number" className="form-input" min="0" value={resource.lcus || 10} onChange={e => onChange('lcus', e.target.value)} placeholder="10" />
      </div>
      <div>
        <label className="form-label">Count</label>
        <input type="number" className="form-input" min="1" value={resource.count || 1} onChange={e => onChange('count', e.target.value)} placeholder="1" />
      </div>
    </div>
  );
}

const FIELD_MAP = {
  ec2: EC2Fields,
  rds: RDSFields,
  s3: S3Fields,
  ecs: ECSFields,
  nat: NATFields,
  alb: ALBFields,
};

export default function ResourceInputForm({ onSubmit, isLoading }) {
  const [resources, setResources] = useState([
    { id: 1, type: 'ec2', name: 'prod-api-server', instance_type: 'm5.4xlarge', count: 6, region: 'us-east-1', usage_hours: 744 },
  ]);

  const addResource = (type) => {
    const typeInfo = RESOURCE_TYPES.find(t => t.value === type);
    setResources(prev => [
      ...prev,
      { id: Date.now(), type, name: `${typeInfo.label} ${prev.filter(r=>r.type===type).length + 1}` },
    ]);
  };

  const removeResource = (id) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const updateResource = (id, field, value) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ resources, input_type: 'form' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {resources.map((resource) => {
        const typeInfo = RESOURCE_TYPES.find(t => t.value === resource.type);
        const FieldsComponent = FIELD_MAP[resource.type];
        const Icon = typeInfo?.icon || Server;

        return (
          <div key={resource.id} className="card p-4">
            {/* Resource header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${typeInfo?.color}15` }}
                >
                  <Icon size={14} style={{ color: typeInfo?.color }} />
                </div>
                <input
                  type="text"
                  value={resource.name}
                  onChange={e => updateResource(resource.id, 'name', e.target.value)}
                  className="font-semibold text-sm bg-transparent border-none outline-none"
                  style={{ color: 'var(--text-primary)' }}
                  placeholder="Resource name..."
                />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{ background: `${typeInfo?.color}15`, color: typeInfo?.color }}
                >
                  {typeInfo?.label}
                </span>
                <button
                  type="button"
                  onClick={() => removeResource(resource.id)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                  disabled={resources.length === 1}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {FieldsComponent && (
              <FieldsComponent
                resource={resource}
                onChange={(field, value) => updateResource(resource.id, field, value)}
              />
            )}
          </div>
        );
      })}

      {/* Add resource */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Add Resource
        </p>
        <div className="flex flex-wrap gap-2">
          {RESOURCE_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => addResource(type.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:shadow-sm"
                style={{
                  background: `${type.color}08`,
                  borderColor: `${type.color}30`,
                  color: type.color,
                }}
                id={`add-${type.value}-btn`}
              >
                <Plus size={13} />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || resources.length === 0}
        className="btn-primary w-full justify-center py-3 text-sm"
        id="analyze-form-submit-btn"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing with AI...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
            Analyze with AI
          </>
        )}
      </button>
    </form>
  );
}
