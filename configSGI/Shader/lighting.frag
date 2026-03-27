#version 330 core
struct Material
{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

struct Light
{
    vec3 position;
    
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;

out vec4 color;

uniform vec3 viewPos;
uniform Material material; 
uniform Light lights[2];  
uniform sampler2D texture_diffuse;

void main()
{
    // Normalizamos los vectores principales 
    vec3 norm = normalize(Normal); 
    vec3 viewDir = normalize(viewPos - FragPos);

    vec3 baseColor = material.diffuse; 

    // Inicializamos el resultado final en cero
    vec3 result = vec3(0.0);

    // Sumamos la influencia de cada luz
    for (int i = 0; i < 2; i++)
    {
        // Ambient 
        vec3 ambient = lights[i].ambient * texture(texture_diffuse, TexCoords).rgb;

        // Diffuse
        vec3 lightDir = normalize(lights[i].position - FragPos);
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = lights[i].diffuse * diff * texture(texture_diffuse, TexCoords).rgb;

        // Specular 
        vec3 reflectDir = reflect(-lightDir, norm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        vec3 specular = lights[i].specular * (spec * material.specular);
        
        // Sumamos al resultado total
        result += ambient + diffuse + specular;
    }

    color = vec4(result, 1.0);
}