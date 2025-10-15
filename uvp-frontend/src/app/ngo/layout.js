"use client";

import OraganizationSideBar from "@/components/OraganizationSideBar";


export default function NGOLayout({ children }) {

  return (
    <div >
      <OraganizationSideBar/>

      {/* Content */}
      <main className="flex-1 sm:ml-64 pt-16">
        <div className="max-w-7xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}


