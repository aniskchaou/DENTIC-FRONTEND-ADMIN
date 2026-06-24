import torch
import torch.nn as nn
import torch.optim as optim

# Example data (replace with your real data)
SYMPTOM_LIST = ["toothache", "swollen gums", "sensitivity to cold", "bleeding gums", "bad breath"]
TREATMENTS = ["Deep Cleaning", "Root Canal", "Filling"]

# X: one-hot symptom vectors, y: treatment indices
X = torch.tensor([
    [1, 0, 0, 0, 1],  # toothache + bad breath
    [1, 1, 0, 1, 0],  # toothache + swollen gums + bleeding gums
    [0, 0, 1, 0, 0],  # sensitivity to cold
], dtype=torch.float32)
y = torch.tensor([0, 1, 2])  # 0: Deep Cleaning, 1: Root Canal, 2: Filling

class TreatmentClassifier(nn.Module):
    def __init__(self, input_size, num_classes):
        super().__init__()
        self.fc = nn.Linear(input_size, num_classes)
    def forward(self, x):
        return self.fc(x)

model = TreatmentClassifier(input_size=5, num_classes=3)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.01)

# Train (for demonstration, just a few epochs)
for epoch in range(100):
    optimizer.zero_grad()
    outputs = model(X)
    loss = criterion(outputs, y)
    loss.backward()
    optimizer.step()

# Export to ONNX
dummy_input = torch.randn(1, 5)
torch.onnx.export(
    model,
    dummy_input,
    "treatment_recommendation.onnx",
    input_names=['input'],
    output_names=['output_label'],
    opset_version=11
)
print("Exported treatment_recommendation.onnx")