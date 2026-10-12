import sys
import os

sys.path.insert(0, r"C:\Users\Bhagyesh\OpenMontage")
from styles.playbook_loader import load_playbook

playbooks = [
    "clean-professional",
    "institutional-underwriting",
    "tactile-journalism",
    "swiss-vector-macro"
]

print("=== OpenMontage Playbook Schema Validation ===")
for name in playbooks:
    try:
        pb = load_playbook(name)
        print(f"PASS: {pb['identity']['name']} ({name}.yaml)")
        print(f"      Palette: {pb['visual_language']['color_palette']['primary']}")
        print(f"      Motion:  {pb['motion']['animation_style']}")
    except Exception as e:
        print(f"FAIL: {name} -> {e}")
