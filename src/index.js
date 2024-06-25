class MemosAPI {
    constructor(baseUrl, token) {
      this.baseUrl = baseUrl;
      this.token = token;
      this.nextPageToken = null;
    }
  
    setToken(token) {
      this.token = token;
    }
  
    getHeaders() {
      return {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      };
    }
  
    async listMemos(params = {}) {
      const url = new URL(`${this.baseUrl}/api/v1/memos`);
      
      // Add query parameters
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  
      // Add pageToken if it exists and is not provided in params
      if (this.nextPageToken && !params.pageToken) {
        url.searchParams.append('pageToken', this.nextPageToken);
      }
  
      try {
        const response = await fetch(url.toString(), {
          headers: this.getHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Update nextPageToken for subsequent requests
        this.nextPageToken = data.nextPageToken || null;
  
        return data;
      } catch (error) {
        console.error("Error fetching memos:", error);
        throw error;
      }
    }
  
    async createMemo(memoData) {
      const url = `${this.baseUrl}/api/v1/memos`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(memoData),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error creating memo:", error);
        throw error;
      }
    }
  
    hasNextPage() {
      return !!this.nextPageToken;
    }
  
    resetPagination() {
      this.nextPageToken = null;
    }
  }
  
  export default MemosAPI;
  
  // Example usage:
  // const token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6InYxIiwidHlwIjoiSldUIn0...';
  // const memosApi = new MemosAPI('https://memos.apidocumentation.com', token);
  // 
  // async function fetchAllMemos() {
  //   let allMemos = [];
  //   do {
  //     const response = await memosApi.listMemos({ pageSize: 10 });
  //     allMemos = allMemos.concat(response.memos);
  //   } while (memosApi.hasNextPage());
  //   return allMemos;
  // }
  // 
  // fetchAllMemos()
  //   .then(memos => console.log(memos))
  //   .catch(error => console.error(error));
  // 
  // // If you need to update the token later:
  // memosApi.setToken('newToken...');