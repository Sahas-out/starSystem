# Rendering a Star System  
Worked on in September 2025 
rendering a 3d star system scene which can be manipulated by user. The project involved understanding of graphics pipeline, user controlled camera, lightning using phong-shading, modelling shapes, animating planet revolution, rotation of planets using quartenion. worked on October 2025. live demo link 


# How to Run 
you need to run a http server 
1. cd to dir containing this README 
2. if you have python3 installed do python3 -m http.server 
3. open your browser and go to http://localhost: (port number should be output given by
above command) 

you can also run it using the live server extension in vs-code 

# How to use 
1. there are buttons for 
    - adding a planet
    - seeing the top camera view (fixed camera)
    - seeing the 3d camera view (movable camera)
2. When in 3d mode use the mouse to rotate the camera.
3. To select a planet click on the planet
    After Selecting you can 
    - Then press the delete planet button to delete it.
    - Then use the mouse to rotate the planet 
    - Then use the mouse wheel to scale up or down the planet
    - Then adjust the speed of the planet using the slider on bottom of screen you can see the new speed of the planet after deselecting it
4. to deselect the planet click on it again

# Credits 
- gl-matrix - https://cdn.skypack.dev/cdt2d used for matrix and vector representation and
calculations.
