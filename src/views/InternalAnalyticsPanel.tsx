import React, { useMemo } from "react"
import DataDashboard from "../components/DataDashboard"
import SimpleAnalyticsChart from "../components/SimpleAnalyticsChart"
import { SystemStatisticsSubToolbox } from "../components/SystemStatisticsSubToolbox"
import { canonicalRowsToMasterTableRows } from "../services/analytics/Selectors"
import { useCanonicalRows } from "../services/analytics-canon"

const InternalAnalyticsPanel: React.FC = () => {
 const canonicalRows = useCanonicalRows("lifetime")
 const masterTableRows = useMemo(
  () => canonicalRowsToMasterTableRows(canonicalRows),
  [canonicalRows],
 )

 return (
  <div className="max-w-[1500px] mx-auto pb-24 px-4 space-y-6">
   <div className="mt-4 px-2 flex flex-col items-center gap-3">
    <h2 className="text-5xl md:text-6xl font-[1000] uppercase tracking-[calc(-0.06em)] leading-none text-black text-center">
     INTERNAL <span className="text-[#00CCFF]">ANALYTICS</span>
    </h2>
    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/40 text-center">
     Hidden panel: canonical dashboard, simple analytics, and coverage reference
    </p>
   </div>

   <SimpleAnalyticsChart />
   <DataDashboard />

   <div className="w-full">
    <SystemStatisticsSubToolbox masterTableRows={masterTableRows} />
   </div>
  </div>
 )
}

export default InternalAnalyticsPanel
