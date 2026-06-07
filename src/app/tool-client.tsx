'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  toolConfig,
  templateBaseVersion,
  textCaseTool,
  ToolCanvas,
  ToolToolbar,
  ToolSidebar,
} from '@/tool';
import { ToolShell, useTool } from '@itsjust/core';
import { convertCase } from '@/tool/lib/case-converter';
import type { TextCaseState } from '@/tool/types';

export default function ToolClient() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const tool = useTool(textCaseTool, canvasRef);
  const setToolData = tool.state.setData;
  const showToast = tool.toast;
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth > 768 && toolConfig.features.sidebar
  );

  const title = toolConfig.name;

  useEffect(() => {
    document.title = title;
  }, [title]);

  const handleStateChange = useCallback(
    (patch: Partial<TextCaseState>) => {
      setToolData((prev) => ({ ...prev, ...patch }));
    },
    [setToolData]
  );

  const handleConvert = useCallback(() => {
    const { input, mode } = tool.state.data;
    if (!input.trim()) {
      showToast('No text to convert', 'error');
      return;
    }
    const output = convertCase(input, mode);
    setToolData((prev) => ({ ...prev, lastOutput: output }));
    showToast(`Converted to ${mode}`, 'success');
  }, [tool.state.data, setToolData, showToast]);

  const toolbarActions = useMemo(() => tool.toolbarActions, [tool.toolbarActions]);

  const toolbarContent = (
    <>
      <ToolToolbar />
    </>
  );

  const sidebarContent = (
    <ToolSidebar
      state={tool.state.data}
      onChange={handleStateChange}
      onConvert={handleConvert}
    />
  );

  const canvasContent = (
    <ToolCanvas
      state={tool.state.data}
      canvasRef={canvasRef}
      onChange={handleStateChange}
    />
  );

  const statusBarContent = (
    <>
      <span
        className={`status-slot status-slot-state ${tool.state.isDirty ? 'status-unsaved' : 'status-saved'}`}
      >
        {tool.state.isDirty ? (
          <>
            <span className="status-saving-dot" />
            Unsaved
          </>
        ) : tool.state.lastSaved ? (
          <>Saved {tool.state.lastSaved}</>
        ) : (
          'Ready'
        )}
      </span>
      <span className="status-slot status-slot-input-length">
        {tool.state.data.input.length} chars
      </span>
      <span className="status-slot status-slot-mode">
        {tool.state.data.mode}
      </span>
      <span className="status-slot status-slot-tool-version">Tool v{toolConfig.version}</span>
      <span className="status-slot status-slot-template-version">
        Template v{templateBaseVersion}
      </span>
    </>
  );

  return (
    <ToolShell
      config={toolConfig}
      actions={toolbarActions}
      sidebarOpen={sidebarOpen}
      onSidebarChange={setSidebarOpen}
      toolbar={toolbarContent}
      sidebar={sidebarContent}
      canvas={canvasContent}
      statusBar={statusBarContent}
    />
  );
}