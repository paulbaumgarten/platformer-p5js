import os
from PIL import Image

def convert_images_to_gif(image_folder, output_file):
    # Create a list to store all the image frames
    frames = []

    # Open each image in the folder and append it to the frames list
    print("Converting PNG to GIF")
    files = os.listdir(image_folder)
    files = sorted(files)
    #for filename in files:
    #    if filename.endswith(".png"):
    #        image_path = os.path.join(image_folder, filename)
    #        print("Using",image_path)
    #        image = Image.open(image_path)
    #        image.save(os.path.join(image_folder, filename.replace(".png",".gif")))
    print("Creating animated GIF at",output_file)
    #files = os.listdir(image_folder)
    #files = sorted(files)
    for filename in files:
        if filename.endswith(".png"):
            image_path = os.path.join(image_folder, filename)
            print("Using",image_path)
            image = Image.open(image_path)
            frames.append(image)

    # Save the frames as an animated GIF
    frames[0].save(output_file, format='GIF', append_images=frames[1:], save_all=True, duration=40, loop=0, disposal=2)

# Provide the path to your image folder and output file
image_folder = """G:/My Drive/0000 PROJECTS/Lunch clubs/2020-21 T1 Pygame/internet collections/platformer-art-complete-pack-0/Base pack/Player/p2_walk/PNG"""
output_file = """G:/My Drive/0000 PROJECTS/Lunch clubs/2020-21 T1 Pygame/internet collections/platformer-art-complete-pack-0/Base pack/Player/p2_walk.gif"""

convert_images_to_gif(image_folder, output_file)