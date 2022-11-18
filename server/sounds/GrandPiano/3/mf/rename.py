import pathlib
import os

def main():
    path = os.path.dirname(__file__)
    os.chdir(path)
    count = 0
    for file in os.listdir():
        old_name = os.listdir()[count]
        new_name = old_name.replace('GrandPiano ', '').replace(' mf', '')
        os.rename(old_name, new_name)
        count += 1
        print(new_name)
main()