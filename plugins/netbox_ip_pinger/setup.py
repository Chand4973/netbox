from setuptools import find_packages, setup

setup(
    name='netbox-ip-pinger',
    version='0.1',
    description='A NetBox plugin to ping and monitor IPs',
    install_requires=[],
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
)
