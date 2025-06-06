// Update your handleSubmit function
const handleSubmit = async () => {
  // ... existing code
  
  try {
    const response = await fetch('/api/save-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenAddress: address })
    });
    
    if (!response.ok) {
      // Get error details from response
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    const result = await response.json();
    setData(result);
  } catch (err) {
    setError('Failed to track token: ' + err.message);
  } finally {
    setLoading(false);
  }
};