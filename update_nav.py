import os
import glob

html_files = glob.glob("d:/office_project_siva/VMS Dhamotharan Thirumana Mandapam/*.html")

dropdown_normal = """        <li class="has-dropdown">
          <a href="services.html" class="nav-link">Services</a>
          <ul class="dropdown-menu">
            <li><a href="services.html#wedding">Wedding</a></li>
            <li><a href="services.html#reception">Reception</a></li>
            <li><a href="services.html#birthday">Birthday Celebrations</a></li>
            <li><a href="services.html#kaathukuthal">Kaathukuthal</a></li>
            <li><a href="services.html#engagement">Engagement</a></li>
            <li><a href="services.html#family">Family Functions</a></li>
          </ul>
        </li>"""

dropdown_active = """        <li class="has-dropdown">
          <a href="services.html" class="nav-link is-active" aria-current="page">Services</a>
          <ul class="dropdown-menu">
            <li><a href="services.html#wedding">Wedding</a></li>
            <li><a href="services.html#reception">Reception</a></li>
            <li><a href="services.html#birthday">Birthday Celebrations</a></li>
            <li><a href="services.html#kaathukuthal">Kaathukuthal</a></li>
            <li><a href="services.html#engagement">Engagement</a></li>
            <li><a href="services.html#family">Family Functions</a></li>
          </ul>
        </li>"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace the normal link
    content = content.replace('<li><a href="services.html" class="nav-link">Services</a></li>', dropdown_normal)
    
    # Replace the active link
    content = content.replace('<li><a href="services.html" class="nav-link is-active" aria-current="page">Services</a></li>', dropdown_active)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Updated {len(html_files)} files.")
