import React, { useState } from 'react';
import { Server, Activity, Database, ShieldCheck, Code2, Cpu, CheckCircle2 } from 'lucide-react';

export const ArchitectureVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topology' | 'code'>('topology');

  return (
    <div className="w-full rounded-xl bg-dark-900 border border-slate-800 shadow-xl overflow-hidden transition-all duration-300 hover:border-slate-700">
      {/* Terminal Title Bar */}
      <div className="bg-dark-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline">
            purchasing-power // microservices-modernization
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-dark-900 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'topology'
                ? 'bg-slate-800 text-electric-cyan font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-slate-800 text-electric-cyan font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Java 17 Code</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      {activeTab === 'topology' ? (
        <div className="p-5 sm:p-6 space-y-5">
          {/* Status Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="bg-dark-950/70 border border-slate-800 rounded-lg p-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <div>
                <div className="text-[10px] text-slate-400">JAVA RUNTIME</div>
                <div className="font-semibold text-slate-200">Java 17 LTS</div>
              </div>
            </div>
            <div className="bg-dark-950/70 border border-slate-800 rounded-lg p-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-electric-cyan"></span>
              <div>
                <div className="text-[10px] text-slate-400">FRAMEWORK</div>
                <div className="font-semibold text-slate-200">Spring Boot 3+</div>
              </div>
            </div>
            <div className="bg-dark-950/70 border border-slate-800 rounded-lg p-2.5 flex items-center gap-2 col-span-2 sm:col-span-1">
              <Activity className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] text-slate-400">OBSERVABILITY</div>
                <div className="font-semibold text-emerald-400">Health Probes UP</div>
              </div>
            </div>
          </div>

          {/* Architecture Visual Grid */}
          <div className="border border-slate-800/80 rounded-xl bg-dark-950/40 p-4 space-y-4">
            {/* Top Gateway Layer */}
            <div className="flex items-center justify-between bg-dark-900 border border-slate-800 rounded-lg px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Server className="w-4 h-4 text-sky-400" />
                <span>REST API Gateway</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded">
                200 OK
              </span>
            </div>

            {/* Connecting lines */}
            <div className="flex justify-around px-8 text-slate-600">
              <div className="w-px h-3 bg-slate-700"></div>
              <div className="w-px h-3 bg-slate-700"></div>
              <div className="w-px h-3 bg-slate-700"></div>
            </div>

            {/* Microservices Cluster */}
            <div className="bg-dark-900/90 border border-slate-800 rounded-lg p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-300 flex items-center gap-1.5 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-electric-cyan" />
                  Modernized Services Cluster (8 Microservices)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Java 11 → Java 17</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                {['Cart Service', 'Checkout Svc', 'Order Processing', 'Recycling Fee', 'Catalog Svc', 'Customer Svc', 'Vendor Proxy', 'Notification Svc'].map(
                  (svc) => (
                    <div
                      key={svc}
                      className="bg-dark-950 border border-slate-800/90 rounded px-2 py-1.5 text-slate-300 flex items-center justify-between hover:border-electric-cyan/40 transition-colors"
                    >
                      <span className="truncate">{svc}</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Connecting lines */}
            <div className="flex justify-around px-8 text-slate-600">
              <div className="w-px h-3 bg-slate-700"></div>
              <div className="w-px h-3 bg-slate-700"></div>
            </div>

            {/* Persistence & External Layer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-dark-900 border border-slate-800 rounded-lg p-3 flex items-center gap-3">
                <div className="p-2 rounded bg-dark-950 border border-slate-800 text-sky-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono font-medium text-slate-200">Spring Data JPA / Hibernate</div>
                  <div className="text-[10px] text-slate-400 font-mono">MySQL &amp; PostgreSQL RDBMS</div>
                </div>
              </div>

              <div className="bg-dark-900 border border-slate-800 rounded-lg p-3 flex items-center gap-3">
                <div className="p-2 rounded bg-dark-950 border border-slate-800 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono font-medium text-slate-200">Third-Party API Health</div>
                  <div className="text-[10px] text-slate-400 font-mono">Periodic Vendor Probing &amp; Alerts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Java Code View */
        <div className="p-4 sm:p-5 font-mono text-xs overflow-x-auto bg-dark-950/80 leading-relaxed text-slate-300">
          <pre>
            <code>
              <span className="code-token-annotation">@RestController</span>{'\n'}
              <span className="code-token-annotation">@RequestMapping</span>(<span className="code-token-string">"/api/v1/modernized"</span>){'\n'}
              <span className="code-token-keyword">public class</span> <span className="code-token-class">OrderServiceController</span> {'{\n\n'}
              {'  '}<span className="code-token-keyword">private final</span> <span className="code-token-class">RecyclingFeeService</span> feeService;{'\n'}
              {'  '}<span className="code-token-keyword">private final</span> <span className="code-token-class">VendorHealthProbe</span> healthProbe;{'\n\n'}
              {'  '}<span className="code-token-comment">// Modern Java 17 constructor injection</span>{'\n'}
              {'  '}<span className="code-token-keyword">public</span> <span className="code-token-class">OrderServiceController</span>(<span className="code-token-class">RecyclingFeeService</span> feeService, <span className="code-token-class">VendorHealthProbe</span> healthProbe) {'{\n'}
              {'    '}<span className="code-token-keyword">this</span>.feeService = feeService;{'\n'}
              {'    '}<span className="code-token-keyword">this</span>.healthProbe = healthProbe;{'\n'}
              {'  }'}{'\n\n'}
              {'  '}<span className="code-token-annotation">@PostMapping</span>(<span className="code-token-string">"/calculate-fee"</span>){'\n'}
              {'  '}<span className="code-token-keyword">public</span> <span className="code-token-class">ResponseEntity</span>&lt;<span className="code-token-class">FeeCalculationResult</span>&gt; calculateFee({'\n'}
              {'      '}<span className="code-token-annotation">@Valid @RequestBody</span> <span className="code-token-class">CartItemRequest</span> request) {'{\n'}
              {'    '}<span className="code-token-class">BigDecimal</span> fee = feeService.calculateRecyclingFee(request.price(), request.category());{'\n'}
              {'    '}<span className="code-token-keyword">return</span> <span className="code-token-class">ResponseEntity</span>.ok(<span className="code-token-keyword">new</span> <span className="code-token-class">FeeCalculationResult</span>(request.itemId(), fee));{'\n'}
              {'  }'}{'\n'}
              {'}'}{'\n\n'}
              <span className="code-token-comment">// Java 17 immutable record</span>{'\n'}
              <span className="code-token-keyword">public record</span> <span className="code-token-class">FeeCalculationResult</span>(<span className="code-token-class">String</span> itemId, <span className="code-token-class">BigDecimal</span> recyclingFee) {'{}'}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};
