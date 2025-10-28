# Problem Statement
rendering a 3d scene with stars, orbits, planets and a movable camera with user functionality for adding/ removing planets and doing rotation abt axis for the planets 

# Scope of Project
Project works on a browser with support for openGl 2.0

# Functional Requirements
- Rendering Stars, orbits, planets and x,y,z axis.
	- setting up  lightning 
	- modelling stars , planets
	- defining parameterized curves for orbits
- animating planets to move in orbits
- setting up a movable camera that always point at center of star system
- user rotation of planets abt axis 
- user scaling of planets 
- user functionality of adding and removing planets
- user controls for camera
- user control for speed of rotation of planets

# Non-Functional Requirements
- friendily user interface for controls of widgets outside canvas element of browser 
- aesthetic lightning on spheres making the scene more 3d realistic
- only mouse usage for all user control 

# Additional Notes specific to assignment
- using quartenions with trackball is necessary  for rotation.
- mouse controls for camera necessary
- plants retain their original size when moving irrespective of user scaling