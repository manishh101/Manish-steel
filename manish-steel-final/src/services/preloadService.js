/**
 * Preload Service - Wakes up the API server on app initialization
 */
class PreloadService {
  static isWakingUp = false;
  static wakeUpPromise = null;

  /**
   * Wake up the API server to prevent cold start delays
   */
  static async wakeUpServer() {
    if (this.isWakingUp && this.wakeUpPromise) {
      return this.wakeUpPromise;
    }

    this.isWakingUp = true;
    console.log('🔥 Warming up server...');

    this.wakeUpPromise = new Promise(async (resolve) => {
      try {
        const apiBaseUrl = process.env.REACT_APP_API_URL || 'https://api.manishsteelfurniture.com.np';
        const baseUrl = apiBaseUrl.replace('/api', '');

        // Send a simple health check to wake up the server
        const response = await fetch(`${baseUrl}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // No timeout - let it take as long as needed to wake up
        });

        if (response.ok) {
          console.log('✅ Server is now warm');
          // Dispatch event to notify components
          window.dispatchEvent(new CustomEvent('server-warmed-up'));
        }
        
        resolve(true);
      } catch (error) {
        console.warn('⚠️ Server warm-up failed:', error.message);
        resolve(false);
      } finally {
        this.isWakingUp = false;
      }
    });

    return this.wakeUpPromise;
  }

  /**
   * Initialize preloading on app start
   */
  static init() {
    // Only preload in production
    if (process.env.NODE_ENV === 'production') {
      // Start warming up immediately when the app loads
      this.wakeUpServer();
      
      // Also warm up when user becomes active after being away
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !this.isWakingUp) {
          this.wakeUpServer();
        }
      });
    }
  }
}

export default PreloadService;
