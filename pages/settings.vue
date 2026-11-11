<template>
  <div class="max-w-3xl mx-auto px-3 sm:px-5 pt-12 sm:pt-14 pb-8 flex flex-col gap-4 sm:gap-5">
    <div class="wz-panel">
      <div class="wz-panel-header">
        <span class="wz-label">Settings</span>
      </div>
      <div class="p-4 flex flex-col gap-4">
        <SettingsLlmProvider />
        <SettingsAgent />
        <SettingsWebResearch />
        <SettingsIntegrationTokens />
        <SettingsReferenceIndex />
      </div>
    </div>
  </div>
</template>
