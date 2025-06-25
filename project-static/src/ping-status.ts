/**
 * Ping Status Management
 * Handles async loading and updating of ping status indicators in device tables
 */

interface PingStatusResponse {
  ping_results: {
    [deviceId: string]: {
      primary_ip: boolean;
      oob_ip: boolean;
    };
  };
  device_count: number;
  timestamp?: string;
}

interface SinglePingStatusResponse {
  device_id: number;
  primary_ip_status: boolean;
  oob_ip_status: boolean;
  primary_ip: string | null;
  oob_ip: string | null;
  error?: string;
}

class PingStatusManager {
  private indicators: NodeListOf<Element>;
  private updateInterval: number = 30000; // 30 seconds
  private timeoutDuration: number = 10000; // 10 seconds
  private retryCount: number = 3;

  constructor() {
    this.indicators = document.querySelectorAll('.ping-status-indicator');
    this.init();
  }

  /**
   * Initialize ping status management
   */
  private init(): void {
    if (this.indicators.length === 0) {
      return;
    }

    // Load initial status
    this.loadBulkPingStatus();

    // Set up periodic updates
    this.setupPeriodicUpdates();

    // Add manual refresh button
    this.addRefreshButton();
  }

  /**
   * Load ping status for all devices on the current page
   */
  private async loadBulkPingStatus(): Promise<void> {
    const deviceIds = this.getDeviceIds();

    if (deviceIds.length === 0) {
      return;
    }

    try {
      const response = await this.fetchWithTimeout('/dcim/devices/bulk-ping-status/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCSRFToken(),
        },
        body: JSON.stringify({ device_ids: deviceIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: PingStatusResponse = await response.json();
      this.updatePingStatusIndicators(data.ping_results);
    } catch (error) {
      console.error('Error loading bulk ping status:', error);
      this.showErrorStatus('Failed to load ping status');
    }
  }

  /**
   * Get all device IDs from the current page
   */
  private getDeviceIds(): number[] {
    const deviceIds: number[] = [];
    this.indicators.forEach(indicator => {
      const deviceId = indicator.getAttribute('data-device-id');
      if (deviceId && !deviceIds.includes(parseInt(deviceId))) {
        deviceIds.push(parseInt(deviceId));
      }
    });
    return deviceIds;
  }

  /**
   * Update ping status indicators with the response data
   */
  private updatePingStatusIndicators(pingResults: {
    [deviceId: string]: { primary_ip: boolean; oob_ip: boolean };
  }): void {
    this.indicators.forEach(indicator => {
      const deviceId = indicator.getAttribute('data-device-id');
      const ipType = indicator.getAttribute('data-ip-type');

      if (!deviceId || !ipType) {
        return;
      }

      const deviceStatus = pingResults[deviceId];
      if (!deviceStatus) {
        this.updateIndicator(indicator, false, 'No status available');
        return;
      }

      let isOnline = false;
      let statusText = 'Offline';

      if (ipType === 'primary') {
        isOnline = deviceStatus.primary_ip;
        statusText = isOnline ? 'Online' : 'Offline';
      } else if (ipType === 'oob') {
        isOnline = deviceStatus.oob_ip;
        statusText = isOnline ? 'Online' : 'Offline';
      }

      this.updateIndicator(indicator, isOnline, statusText);
    });
  }

  /**
   * Update a single ping status indicator
   */
  private updateIndicator(indicator: Element, isOnline: boolean, statusText: string): void {
    const iconElement = indicator.querySelector('i');
    const textElement = indicator.querySelector('.ping-status-text');

    if (!iconElement || !textElement) {
      return;
    }

    // Remove loading classes
    iconElement.classList.remove('mdi-loading', 'mdi-spin', 'text-muted');

    // Update icon and color based on status
    if (isOnline) {
      iconElement.className = 'mdi mdi-check-circle text-success';
      indicator.setAttribute(
        'title',
        `${statusText} - Last checked: ${new Date().toLocaleTimeString()}`,
      );
    } else {
      iconElement.className = 'mdi mdi-close-circle text-danger';
      indicator.setAttribute(
        'title',
        `${statusText} - Last checked: ${new Date().toLocaleTimeString()}`,
      );
    }

    // Update text
    textElement.textContent = statusText;
  }

  /**
   * Show error status on all indicators
   */
  private showErrorStatus(errorMessage: string): void {
    this.indicators.forEach(indicator => {
      const iconElement = indicator.querySelector('i');
      const textElement = indicator.querySelector('.ping-status-text');

      if (iconElement && textElement) {
        iconElement.className = 'mdi mdi-alert-circle text-warning';
        textElement.textContent = 'Error';
        indicator.setAttribute('title', errorMessage);
      }
    });
  }

  /**
   * Setup periodic updates of ping status
   */
  private setupPeriodicUpdates(): void {
    setInterval(() => {
      this.loadBulkPingStatus();
    }, this.updateInterval);
  }

  /**
   * Add a manual refresh button to the page
   */
  private addRefreshButton(): void {
    const tableHeader = document.querySelector('.table-responsive');
    if (!tableHeader) {
      return;
    }

    const refreshButton = document.createElement('button');
    refreshButton.className = 'btn btn-outline-primary btn-sm mb-2';
    refreshButton.innerHTML = '<i class="mdi mdi-refresh"></i> Refresh Ping Status';
    refreshButton.title = 'Manually refresh ping status for all devices';

    refreshButton.addEventListener('click', () => {
      // Reset all indicators to loading state
      this.resetIndicatorsToLoading();
      // Load fresh status
      this.loadBulkPingStatus();
    });

    // Insert button before the table
    tableHeader.parentNode?.insertBefore(refreshButton, tableHeader);
  }

  /**
   * Reset all indicators to loading state
   */
  private resetIndicatorsToLoading(): void {
    this.indicators.forEach(indicator => {
      const iconElement = indicator.querySelector('i');
      const textElement = indicator.querySelector('.ping-status-text');

      if (iconElement && textElement) {
        iconElement.className = 'mdi mdi-loading mdi-spin text-muted';
        textElement.textContent = 'Loading...';
        indicator.setAttribute('title', 'Loading ping status...');
      }
    });
  }

  /**
   * Fetch with timeout support
   */
  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutDuration);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Get CSRF token from the page
   */
  private getCSRFToken(): string {
    const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    if (meta) {
      return meta.content;
    }

    // Fallback: try to get from cookie
    const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));

    return cookie ? cookie.split('=')[1] : '';
  }
}

// Initialize ping status management when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PingStatusManager();
});

// Export for potential external use
export { PingStatusManager };
