
import { Brain, Activity, ShieldCheck, Cpu } from 'lucide-react';

const AIModelInfo = () => {
  return (
    <section id="ai-models" className="py-20 px-4 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-secondary mb-4">Powered by Advanced AI</h2>
          <p className="text-text-gray max-w-2xl mx-auto">
            Our platform utilizes state-of-the-art deep learning models to assist doctors in early disease detection and continuous patient monitoring.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Model 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-card border border-gray-50 hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain size={28} />
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-3">Leukemia Detection</h3>
            <p className="text-text-gray text-sm leading-relaxed mb-6">
              Computer vision models analyze blood smear microscopy images to detect abnormal white blood cells with 98.2% accuracy.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg w-max">
              <Cpu size={14} /> v2.4.1 Deployed
            </div>
          </div>

          {/* Model 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-card border border-gray-50 hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity size={28} />
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-3">Pneumonia Classifier</h3>
            <p className="text-text-gray text-sm leading-relaxed mb-6">
              Deep learning algorithms process chest X-rays to identify signs of pneumonia and other lung anomalies in seconds.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg w-max">
              <Cpu size={14} /> v1.8.0 Deployed
            </div>
          </div>

          {/* Model 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-card border border-gray-50 hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-3">Vitals Anomaly Predictor</h3>
            <p className="text-text-gray text-sm leading-relaxed mb-6">
              Time-series analysis of continuous patient vitals to predict critical events before they happen, ensuring proactive care.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-max">
              <Cpu size={14} /> v3.0.0 Beta
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIModelInfo;
