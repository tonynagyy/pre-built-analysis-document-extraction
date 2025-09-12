import { Eye, EyeOff } from "lucide-react";

const FORM_TYPES = {
  invoice: "invoice",
  receipt: "receipt",
  businessCard: "businessCard",
  id: "idDocument",
};

export default function Configuration({
  endpoint,
  setEndpoint,
  apiKey,
  setApiKey,
  showApiKey,
  setShowApiKey,
  formType,
  setFormType,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-600"></div>
        <span className="px-4 text-sm font-medium text-gray-300">
          2. Configuration
        </span>
        <div className="flex-1 border-t border-gray-600"></div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Form recognizer service endpoint
          </label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Enter endpoint URL"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-2">API key</label>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-gray-700 text-white text-sm px-3 py-2 pr-10 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter API key"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showApiKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-2">Form Type</label>
          <select
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            className="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="invoice">Invoice</option>
            <option value="receipt">Receipt</option>
            <option value="businessCard">Business Card</option>
            <option value="id">ID Document</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-2">
            API Request URL
          </label>
          <div className="bg-gray-700 p-3 rounded text-xs text-gray-300 font-mono break-all">
            /formrecognizer/v2.1/prebuilt/{FORM_TYPES[formType]}
            /analyze?includeTextDetails=true
          </div>
        </div>
      </div>
    </div>
  );
}
