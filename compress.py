import pickle
import gzip

# Load your data
data = {"key": "value"}

# Save data as a pickle file and compress it using gzip
with gzip.open('embeddings.pkl.gz', 'wb') as f:
    pickle.dump(data, f)
