import { ShieldAlert } from 'lucide-react';

export default function PermissionGate({ permission, action = 'perform this action' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8 text-yellow-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Permission Required
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-2">
        You need the <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{permission}</code> permission to {action}.
      </p>
      <p className="text-sm text-gray-500">
        Please contact your administrator if you believe you should have access.
      </p>
    </div>
  );
}
